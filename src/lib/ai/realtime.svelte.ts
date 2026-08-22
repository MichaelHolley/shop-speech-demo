import { RealtimeClient } from '@tanstack/ai-client';
import { openaiRealtime } from '@tanstack/ai-openai';
import type { RealtimeMessage, RealtimeMode, RealtimeStatus } from '@tanstack/ai';
import { voiceTools } from './tools';
import { instructions } from './instructions';

async function fetchToken() {
	const response = await fetch('/api/realtime-token', { method: 'POST' });
	if (!response.ok) {
		const detail = await response.text().catch(() => '');
		throw new Error(detail || `Token request failed (${response.status})`);
	}
	return response.json();
}

export function createVoiceChat() {
	let status = $state<RealtimeStatus>('idle');
	let mode = $state<RealtimeMode>('idle');
	let messages = $state<RealtimeMessage[]>([]);
	let error = $state<Error | null>(null);
	let pendingUser = $state<string | null>(null);
	let pendingAssistant = $state<string | null>(null);
	let inputLevel = $state(0);

	let client: RealtimeClient | null = null;
	let frame = 0;

	function pollLevels() {
		const tick = () => {
			inputLevel = client?.audio?.inputLevel ?? 0;
			frame = requestAnimationFrame(tick);
		};
		tick();
	}

	function build() {
		const instance = new RealtimeClient({
			getToken: fetchToken,
			adapter: openaiRealtime(),
			instructions,
			voice: 'alloy',
			vadMode: 'semantic',
			tools: voiceTools,
			onError: (err) => {
				error = err;
			}
		});
		instance.onStateChange((state) => {
			status = state.status;
			mode = state.mode;
			messages = state.messages;
			error = state.error;
			pendingUser = state.pendingUserTranscript;
			pendingAssistant = state.pendingAssistantTranscript;
		});
		return instance;
	}

	return {
		get status() {
			return status;
		},
		get mode() {
			return mode;
		},
		get messages() {
			return messages;
		},
		get error() {
			return error;
		},
		get pendingUser() {
			return pendingUser;
		},
		get pendingAssistant() {
			return pendingAssistant;
		},
		get inputLevel() {
			return inputLevel;
		},
		async connect() {
			error = null;
			client ??= build();
			await client.connect();
			pollLevels();
		},
		async disconnect() {
			cancelAnimationFrame(frame);
			inputLevel = 0;
			await client?.disconnect();
		},
		interrupt() {
			client?.interrupt();
		},
		destroy() {
			cancelAnimationFrame(frame);
			client?.destroy();
			client = null;
		}
	};
}
