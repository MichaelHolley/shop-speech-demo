<script lang="ts">
	import type { RealtimeMessagePart } from '@tanstack/ai';
	import type { createVoiceChat } from '#lib/ai/realtime.svelte.js';

	let { voice }: { voice: ReturnType<typeof createVoiceChat> } = $props();

	const statusLabel: Record<string, string> = {
		idle: 'Tap to start',
		connecting: 'Connecting…',
		connected: 'Listening',
		reconnecting: 'Reconnecting…',
		error: 'Connection error'
	};

	const modeLabel: Record<string, string> = {
		idle: 'Ready',
		listening: 'Listening to you',
		thinking: 'Thinking…',
		speaking: 'Speaking'
	};

	let live = $derived(voice.status === 'connected' || voice.status === 'reconnecting');
</script>

<aside
	class="fixed right-4 bottom-4 z-40 flex w-80 flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur"
>
	<div class="flex items-center justify-between">
		<div>
			<p class="text-sm font-semibold text-slate-900">Concierge</p>
			<p class="text-xs text-slate-500">
				{statusLabel[voice.status] ?? voice.status}{#if live} · {modeLabel[voice.mode] ?? voice.mode}{/if}
			</p>
		</div>
		{#if live}
			<button
				onclick={() => voice.interrupt()}
				disabled={voice.mode !== 'speaking'}
				class="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40"
			>
				Interrupt
			</button>
		{/if}
	</div>

	{#if live}
		<div class="h-1.5 overflow-hidden rounded-full bg-slate-200">
			<div
				class="h-full rounded-full bg-emerald-500 transition-[width] duration-75"
				style="width: {Math.min(100, Math.round(voice.inputLevel * 140))}%"
			></div>
		</div>
	{/if}

	{#if voice.error}
		<p class="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">{voice.error.message}</p>
	{/if}

	<div class="flex max-h-64 flex-col gap-2 overflow-y-auto text-sm">
		{#each voice.messages as message (message.id)}
			{@const text = message.parts
				.map((part: RealtimeMessagePart) =>
					part.type === 'text' ? part.content : part.type === 'audio' ? part.transcript : ''
				)
				.join(' ')
				.trim()}
			{#if text}
				<div class={message.role === 'user' ? 'text-right' : 'text-left'}>
					<span
						class="inline-block rounded-2xl px-3 py-1.5 {message.role === 'user'
							? 'bg-indigo-600 text-white'
							: 'bg-slate-100 text-slate-800'}"
					>
						{text}
					</span>
				</div>
			{/if}
		{/each}

		{#if voice.pendingUser}
			<div class="text-right">
				<span class="inline-block rounded-2xl bg-indigo-100 px-3 py-1.5 text-indigo-700 italic">
					{voice.pendingUser}…
				</span>
			</div>
		{/if}
		{#if voice.pendingAssistant}
			<div class="text-left">
				<span class="inline-block rounded-2xl bg-slate-50 px-3 py-1.5 text-slate-500 italic">
					{voice.pendingAssistant}…
				</span>
			</div>
		{/if}
	</div>

	<p class="text-center text-[11px] text-slate-400">Just speak — no need to press anything.</p>
</aside>
