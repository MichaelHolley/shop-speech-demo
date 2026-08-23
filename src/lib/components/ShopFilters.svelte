<script lang="ts">
	import { shop } from '#lib/stores/shop.svelte.js';
	import { allCategories } from '#lib/data/books.js';
</script>

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
