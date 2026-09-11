<script lang="ts">
	import type { RealtimeMessagePart } from '@tanstack/ai';
	import type { createVoiceChat } from '#lib/ai/realtime.svelte.js';

	let { voice }: { voice: ReturnType<typeof createVoiceChat> } = $props();

	const statusLabel: Record<string, string> = {
		idle: 'Desk closed',
		connecting: 'Opening the line…',
		connected: 'Listening',
		reconnecting: 'Reconnecting…',
		error: 'Line trouble'
	};

	const modeLabel: Record<string, string> = {
		idle: 'Ready',
		listening: 'Your turn',
		thinking: 'Checking the drawer',
		speaking: 'Answering'
	};

	let live = $derived(voice.status === 'connected' || voice.status === 'reconnecting');
</script>

<aside
	class="fixed right-4 bottom-4 z-40 flex w-80 flex-col gap-3 rounded-[2px] bg-ink p-4 shadow-[0_20px_44px_-16px_rgba(32,36,31,0.75)]"
>
	<div class="flex items-start justify-between gap-3">
		<div>
			<p class="font-typed text-[11px] tracking-[0.18em] text-stock uppercase">Reference desk</p>
			<p class="mt-0.5 font-typed text-[10px] tracking-[0.12em] text-stock/55 uppercase">
				{statusLabel[voice.status] ?? voice.status}{#if live}
					· {voice.muted ? 'Mic muted' : (modeLabel[voice.mode] ?? voice.mode)}{/if}
			</p>
		</div>
		{#if live}
			<button
				onclick={() => voice.toggleMute()}
				aria-pressed={voice.muted}
				class="shrink-0 rounded-[1px] border px-2 py-1 font-typed text-[10px] tracking-[0.14em] uppercase transition {voice.muted
					? 'border-accession bg-accession text-stock'
					: 'border-stock/40 text-stock/80 hover:border-stock hover:text-stock'}"
			>
				{voice.muted ? 'Unmute' : 'Mute'}
			</button>
		{/if}
	</div>

	{#if live}
		<div class="h-1 overflow-hidden bg-stock/15">
			<div
				class="h-full bg-accession transition-[width] duration-75"
				style="width: {Math.min(100, Math.round(voice.inputLevel * 140))}%"
			></div>
		</div>
	{/if}

	{#if voice.error}
		<p class="rounded-[1px] bg-accession px-3 py-2 font-typed text-[11px] text-stock">
			{voice.error.message}
		</p>
	{/if}

	<div class="flex max-h-64 flex-col gap-2 overflow-y-auto font-note text-[15px] leading-snug">
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
						class="inline-block rounded-[1px] px-3 py-1.5 {message.role === 'user'
							? 'bg-stock text-ink'
							: 'bg-stock/10 text-stock'}"
					>
						{text}
					</span>
				</div>
			{/if}
		{/each}

		{#if voice.pendingUser}
			<div class="text-right">
				<span class="inline-block rounded-[1px] bg-stock/70 px-3 py-1.5 text-ink/70 italic">
					{voice.pendingUser}…
				</span>
			</div>
		{/if}
		{#if voice.pendingAssistant}
			<div class="text-left">
				<span class="inline-block rounded-[1px] bg-stock/5 px-3 py-1.5 text-stock/60 italic">
					{voice.pendingAssistant}…
				</span>
			</div>
		{/if}
	</div>

	<p class="text-center font-typed text-[9px] tracking-[0.14em] text-stock/40 uppercase">
		Just speak — the desk is listening
	</p>
</aside>
