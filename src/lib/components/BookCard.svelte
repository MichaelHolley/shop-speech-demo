<script lang="ts">
	import type { Book } from '#lib/types/book.js';
	import { callNumber, filingName, shelfPrice } from '#lib/format.js';

	let {
		book,
		selected = false,
		onselect
	}: { book: Book; selected?: boolean; onselect: (id: string) => void } = $props();
</script>

<li class="flex">
	<button
		type="button"
		onclick={() => onselect(book.id)}
		aria-pressed={selected}
		class="group flex w-full flex-col rounded-[2px] border bg-stock text-left shadow-[0_2px_4px_rgba(32,36,31,0.28)] transition duration-200 outline-none hover:-rotate-[0.4deg] hover:shadow-[0_12px_26px_-8px_rgba(32,36,31,0.55)] focus-visible:ring-2 focus-visible:ring-accession motion-reduce:hover:rotate-0 {selected
			? 'border-accession ring-1 ring-accession'
			: 'border-stock-edge'}"
	>
		<div class="flex items-start justify-between px-5 pt-4">
			<span
				class="rounded-[1px] px-1 py-0.5 font-typed text-[11px] tracking-[0.18em] {selected
					? 'bg-accession text-stock'
					: 'text-accession'}"
			>
				{callNumber(book)}
			</span>
			<span
				class="mt-0.5 h-3 w-3 rounded-full bg-stock-edge shadow-[inset_0_1px_2px_rgba(32,36,31,0.35)]"
			></span>
		</div>

		<div class="mx-5 mt-3 border-b-[3px] border-double border-ink/30"></div>

		<div class="px-5 pt-3">
			<h2 class="font-typed text-lg leading-snug font-bold text-ink">{book.title}</h2>
			<p class="mt-0.5 font-typed text-[13px] text-ink-soft">{filingName(book.author)}</p>
		</div>

		<div class="mx-5 mt-3 border-t border-dashed border-rule"></div>

		<p class="flex-1 px-5 py-3 font-note text-[15px] leading-relaxed text-ink-soft">
			{book.description}
		</p>

		<div class="mx-5 border-t border-dashed border-rule"></div>

		<div class="flex items-end justify-between gap-4 px-5 py-3">
			<ul class="flex flex-wrap gap-x-3 gap-y-1">
				{#each book.categories as category (category)}
					<li
						class="flex items-center gap-1.5 font-typed text-[10px] tracking-[0.14em] text-ink-soft uppercase"
					>
						<span class="h-2 w-2" style="background-color: {book.coverColor}"></span>
						{category}
					</li>
				{/each}
			</ul>
			<span class="font-typed text-sm text-ink tabular-nums">{shelfPrice(book.price)}</span>
		</div>
	</button>
</li>
