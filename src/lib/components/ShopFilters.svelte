<script lang="ts">
	import { shop } from '#lib/stores/shop.svelte.js';
	import { allCategories } from '#lib/data/books.js';
</script>

<section class="mb-8 rounded-[2px] bg-ink shadow-[0_10px_24px_-14px_rgba(32,36,31,0.9)]">
	<div class="flex flex-wrap items-end gap-x-8 gap-y-4 px-5 py-4">
		<label class="flex min-w-56 flex-1 flex-col gap-1">
			<span class="font-typed text-[10px] tracking-[0.18em] text-stock/50 uppercase">Search</span>
			<input
				type="search"
				placeholder="title, author, subject…"
				bind:value={shop.search}
				class="border-b border-stock/30 bg-transparent pb-1 font-typed text-sm text-stock outline-none placeholder:text-stock/35 focus:border-accession"
			/>
		</label>
		<label class="flex flex-col gap-1">
			<span class="font-typed text-[10px] tracking-[0.18em] text-stock/50 uppercase">Filed by</span>
			<select
				bind:value={shop.sort}
				class="border-b border-stock/30 bg-transparent pb-1 font-typed text-sm text-stock outline-none focus:border-accession [&>option]:text-ink"
			>
				<option value="relevance">Shelf order</option>
				<option value="price-asc">Price, low to high</option>
				<option value="price-desc">Price, high to low</option>
				<option value="title">Title, A–Z</option>
			</select>
		</label>
		<button
			onclick={() => shop.reset()}
			class="pb-1 font-typed text-[11px] tracking-[0.16em] text-accession uppercase underline-offset-4 hover:underline"
		>
			Refile all
		</button>
	</div>

	<div class="mx-5 border-t border-dashed border-stock/20"></div>

	<div class="flex flex-wrap gap-1.5 px-5 py-4">
		{#each allCategories as category (category)}
			{@const active = shop.categories.includes(category)}
			<button
				onclick={() => shop.toggleCategory(category)}
				aria-pressed={active}
				class="rounded-[1px] border px-2 py-1 font-typed text-[10px] tracking-[0.14em] uppercase transition {active
					? 'border-stock bg-stock text-ink'
					: 'border-stock/25 text-stock/70 hover:border-stock hover:text-stock'}"
			>
				{category}
			</button>
		{/each}
	</div>

	<div class="mx-5 border-t border-dashed border-stock/20"></div>

	<p class="px-5 py-3 font-typed text-[11px] tracking-[0.12em] text-stock/55 uppercase">
		{shop.filtered.length} cards in drawer
		{#if shop.activeFilters.length}
			· {shop.activeFilters.join(' · ')}
		{/if}
	</p>
</section>
