<script lang="ts">
	import { getBooks } from './books.remote';

	const priceFormatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	});
</script>

<main class="mx-auto max-w-6xl px-6 py-12">
	<header class="mb-10">
		<h1 class="text-3xl font-bold tracking-tight text-slate-900">Bookshop</h1>
		<p class="mt-2 text-slate-600">Browse our curated selection across every genre.</p>
	</header>

	<svelte:boundary>
		<ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each await getBooks() as book (book.id)}
				<li
					class="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
				>
					<div
						class="flex h-40 items-center justify-center px-6 text-center text-lg font-semibold text-white"
						style="background-color: {book.coverColor}"
					>
						{book.title}
					</div>
					<div class="flex flex-1 flex-col p-5">
						<h2 class="text-lg font-semibold text-slate-900">{book.title}</h2>
						<p class="text-sm text-slate-500">{book.author}</p>
						<ul class="mt-3 flex flex-wrap gap-1.5">
							{#each book.categories as category (category)}
								<li
									class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
								>
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

		{#snippet pending()}
			<p class="text-slate-500">Loading books…</p>
		{/snippet}
	</svelte:boundary>
</main>
