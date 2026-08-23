<script lang="ts">
	import type { Book } from '#lib/types/book.js';
	import { priceFormatter } from '#lib/format.js';

	let { book, onclose }: { book: Book; onclose: () => void } = $props();
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
	role="button"
	tabindex="-1"
	onclick={onclose}
	onkeydown={(event) => {
		if (event.key === 'Enter') onclose();
	}}
>
	<div
		class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
		role="dialog"
		aria-modal="true"
		aria-label={book.title}
		tabindex="-1"
		onclick={(event) => event.stopPropagation()}
		onkeydown={(event) => event.stopPropagation()}
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
					onclick={onclose}
					class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
				>
					Close
				</button>
			</div>
		</div>
	</div>
</div>
