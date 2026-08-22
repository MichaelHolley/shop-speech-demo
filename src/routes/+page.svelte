<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { RealtimeMessagePart } from '@tanstack/ai';
	import { shop } from '#lib/stores/shop.svelte.js';
	import { allCategories } from '#lib/data/books.js';
	import { createVoiceChat } from '#lib/ai/realtime.svelte.js';

	const priceFormatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	});

	const voice = createVoiceChat();
	onDestroy(() => voice.destroy());

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

	<section class="mb-6 space-y-3 rounded-xl border border-slate-200 bg-white/60 p-4">
		<div class="flex flex-wrap items-center gap-3">
			<input
				type="search"
				placeholder="Search title, author, description…"
				bind:value={shop.search}
				class="min-w-56 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-500"
			/>
			<select
				bind:value={shop.sort}
				class="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-500"
			>
				<option value="relevance">Sort: Featured</option>
				<option value="price-asc">Price: Low to High</option>
				<option value="price-desc">Price: High to Low</option>
				<option value="title">Title: A–Z</option>
			</select>
			<button
				onclick={() => shop.reset()}
				class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
			>
				Clear
			</button>
		</div>

		<div class="flex flex-wrap gap-1.5">
			{#each allCategories as category (category)}
				{@const active = shop.categories.includes(category)}
				<button
					onclick={() => shop.toggleCategory(category)}
					class="rounded-full px-2.5 py-1 text-xs font-medium transition {active
						? 'bg-indigo-600 text-white'
						: 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
				>
					{category}
				</button>
			{/each}
		</div>

		<p class="text-sm text-slate-500">
			Showing <span class="font-semibold text-slate-800">{shop.filtered.length}</span> books
			{#if shop.activeFilters.length}
				· {shop.activeFilters.join(' · ')}
			{/if}
		</p>
	</section>

	{#if shop.filtered.length === 0}
		<p class="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
			No books match these filters. Try clearing one.
		</p>
	{:else}
		<ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each shop.filtered as book (book.id)}
				<li
					class="flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md {shop.selectedId ===
					book.id
						? 'border-indigo-500 ring-2 ring-indigo-200'
						: 'border-slate-200'}"
				>
					<button
						type="button"
						onclick={() => shop.select(book.id)}
						class="flex h-40 items-center justify-center px-6 text-center text-lg font-semibold text-white"
						style="background-color: {book.coverColor}"
					>
						{book.title}
					</button>
					<div class="flex flex-1 flex-col p-5">
						<h2 class="text-lg font-semibold text-slate-900">{book.title}</h2>
						<p class="text-sm text-slate-500">{book.author}</p>
						<ul class="mt-3 flex flex-wrap gap-1.5">
							{#each book.categories as category (category)}
								<li class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
									{category}
								</li>
							{/each}
						</ul>
						<p class="mt-3 flex-1 text-sm text-slate-600">{book.description}</p>
						<p class="mt-4 text-lg font-bold text-slate-900">
							{priceFormatter.format(book.price)}
						</p>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</main>

{#if live || voice.messages.length}
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
{/if}

{#if shop.selectedBook}
	{@const book = shop.selectedBook}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
		role="button"
		tabindex="-1"
		onclick={() => shop.select(null)}
		onkeydown={(event) => {
			if (event.key === 'Enter') shop.select(null);
		}}
	>
		<div
			class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
			role="dialog"
			aria-modal="true"
			aria-label={book.title}
		>
			<div
				class="flex h-44 items-center justify-center px-8 text-center text-2xl font-bold text-white"
				style="background-color: {book.coverColor}"
			>
				{book.title}
			</div>
			<div class="p-6">
				<h2 class="text-xl font-bold text-slate-900">{book.title}</h2>
				<p class="text-sm text-slate-500">{book.author}</p>
				<ul class="mt-3 flex flex-wrap gap-1.5">
					{#each book.categories as category (category)}
						<li class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
							{category}
						</li>
					{/each}
				</ul>
				<p class="mt-4 text-slate-600">{book.description}</p>
				<div class="mt-6 flex items-center justify-between">
					<span class="text-2xl font-bold text-slate-900">{priceFormatter.format(book.price)}</span>
					<button
						onclick={() => shop.select(null)}
						class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
