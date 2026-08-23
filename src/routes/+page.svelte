<script lang="ts">
	import { onDestroy } from 'svelte';
	import { shop } from '#lib/stores/shop.svelte.js';
	import { createVoiceChat } from '#lib/ai/realtime.svelte.js';
	import BookCard from '#lib/components/BookCard.svelte';
	import BookDetailModal from '#lib/components/BookDetailModal.svelte';
	import ConciergePanel from '#lib/components/ConciergePanel.svelte';
	import ShopFilters from '#lib/components/ShopFilters.svelte';

	const voice = createVoiceChat();
	onDestroy(() => voice.destroy());

	let live = $derived(voice.status === 'connected' || voice.status === 'reconnecting');
	let busy = $derived(voice.status === 'connecting');

	async function toggleCall() {
		if (live) {
			await voice.disconnect();
		} else {
			await voice.connect();
		}
	}
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape') shop.select(null);
	}}
/>

<main class="mx-auto max-w-6xl px-6 py-10">
	<header class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold tracking-tight text-slate-900">Bookshop</h1>
			<p class="mt-1 text-slate-600">Browse by hand — or just talk to the concierge.</p>
		</div>
		<button
			onclick={toggleCall}
			disabled={busy}
			class="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:opacity-60 {live
				? 'bg-rose-600 hover:bg-rose-700'
				: 'bg-indigo-600 hover:bg-indigo-700'}"
		>
			<span class="relative flex h-2.5 w-2.5">
				{#if live}
					<span
						class="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"
					></span>
				{/if}
				<span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-white"></span>
			</span>
			{live ? 'End conversation' : busy ? 'Connecting…' : 'Talk to concierge'}
		</button>
	</header>

	<ShopFilters />

	{#if shop.filtered.length === 0}
		<p class="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
			No books match these filters. Try clearing one.
		</p>
	{:else}
		<ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each shop.filtered as book (book.id)}
				<BookCard {book} selected={shop.selectedId === book.id} onselect={(id) => shop.select(id)} />
			{/each}
		</ul>
	{/if}
</main>

{#if voice.status !== 'idle' || voice.messages.length}
	<ConciergePanel {voice} />
{/if}

{#if shop.selectedBook}
	<BookDetailModal book={shop.selectedBook} onclose={() => shop.select(null)} />
{/if}
