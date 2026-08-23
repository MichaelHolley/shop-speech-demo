<script lang="ts">
	import type { Book } from '#lib/types/book.js';
	import { priceFormatter } from '#lib/format.js';

	let {
		book,
		selected = false,
		onselect
	}: { book: Book; selected?: boolean; onselect: (id: string) => void } = $props();
</script>

<li
	class="flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md {selected
		? 'border-indigo-500 ring-2 ring-indigo-200'
		: 'border-slate-200'}"
>
	<button
		type="button"
		onclick={() => onselect(book.id)}
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
