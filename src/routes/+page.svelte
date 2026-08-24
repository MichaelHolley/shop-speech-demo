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
	<header
		class="mb-1.5 flex flex-wrap items-center justify-between gap-4 rounded-[2px] bg-ink px-6 py-5"
	>
		<div>
			<h1 class="font-typed text-2xl font-bold tracking-[0.2em] text-stock uppercase">Bookshop</h1>
			<p class="mt-1 font-typed text-[11px] tracking-[0.16em] text-stock/60 uppercase">
				Card catalogue · ask at the desk
			</p>
		</div>
		<button
			onclick={toggleCall}
			disabled={busy}
			class="inline-flex items-center gap-2.5 rounded-[2px] px-4 py-2.5 font-typed text-[12px] tracking-[0.16em] uppercase transition outline-none focus-visible:ring-2 focus-visible:ring-stock disabled:opacity-50 {live
				? 'bg-accession text-stock hover:bg-accession/85'
				: 'bg-stock text-ink hover:bg-white'}"
		>
			<span class="relative flex h-2 w-2">
				{#if live}
					<span class="absolute inline-flex h-full w-full animate-ping bg-stock opacity-75"></span>
				{/if}
				<span class="relative inline-flex h-2 w-2 {live ? 'bg-stock' : 'bg-accession'}"></span>
			</span>
			{live ? 'End conversation' : busy ? 'Connecting…' : 'Talk to concierge'}
		</button>
	</header>

	<ShopFilters />

	{#if shop.filtered.length === 0}
		<p
			class="rounded-[2px] border border-dashed border-ink/30 p-12 text-center font-typed text-[13px] tracking-[0.1em] text-ink-soft uppercase"
		>
			No cards in this drawer. Clear a filter to refile.
		</p>
	{:else}
		<ul class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each shop.filtered as book (book.id)}
				<BookCard
					{book}
					selected={shop.selectedId === book.id}
					onselect={(id) => shop.select(id)}
				/>
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
