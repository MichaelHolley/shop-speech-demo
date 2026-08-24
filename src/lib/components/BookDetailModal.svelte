<script lang="ts">
	import type { Book } from '#lib/types/book.js';
	import { callNumber, filingName, shelfPrice } from '#lib/format.js';

	let { book, onclose }: { book: Book; onclose: () => void } = $props();
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4"
	role="button"
	tabindex="-1"
	onclick={onclose}
	onkeydown={(event) => {
		if (event.key === 'Enter') onclose();
	}}
>
	<div
		class="w-full max-w-lg rounded-[2px] border border-stock-edge bg-stock shadow-[0_24px_60px_-20px_rgba(32,36,31,0.8)]"
		role="dialog"
		aria-modal="true"
		aria-label={book.title}
		tabindex="-1"
		onclick={(event) => event.stopPropagation()}
		onkeydown={(event) => event.stopPropagation()}
	>
		<div class="flex items-start justify-between px-7 pt-6">
			<span class="font-typed text-xs tracking-[0.18em] text-accession">{callNumber(book)}</span>
			<span
				class="mt-0.5 h-3 w-3 rounded-full bg-stock-edge shadow-[inset_0_1px_2px_rgba(32,36,31,0.35)]"
			></span>
		</div>

		<div class="mx-7 mt-4 border-b-[3px] border-double border-ink/30"></div>

		<div class="px-7 pt-4">
			<h2 class="font-typed text-2xl leading-tight font-bold text-ink">{book.title}</h2>
			<p class="mt-1 font-typed text-sm text-ink-soft">{filingName(book.author)}</p>
		</div>

		<div class="mx-7 mt-4 border-t border-dashed border-rule"></div>

		<p class="px-7 py-4 font-note text-[17px] leading-relaxed text-ink-soft">{book.description}</p>

		<div class="mx-7 border-t border-dashed border-rule"></div>

		<ul class="flex flex-wrap gap-x-4 gap-y-1.5 px-7 py-4">
			{#each book.categories as category (category)}
				<li
					class="flex items-center gap-1.5 font-typed text-[11px] tracking-[0.14em] text-ink-soft uppercase"
				>
					<span class="h-2 w-2" style="background-color: {book.coverColor}"></span>
					{category}
				</li>
			{/each}
		</ul>

		<div class="mx-7 border-t border-dashed border-rule"></div>

		<div class="flex items-center justify-between gap-4 px-7 py-5">
			<span class="font-typed text-xl text-ink tabular-nums">{shelfPrice(book.price)}</span>
			<button
				onclick={onclose}
				class="rounded-[2px] bg-ink px-4 py-2 font-typed text-[11px] tracking-[0.16em] text-stock uppercase transition outline-none hover:bg-ink/85 focus-visible:ring-2 focus-visible:ring-accession"
			>
				Return to drawer
			</button>
		</div>
	</div>
</div>
