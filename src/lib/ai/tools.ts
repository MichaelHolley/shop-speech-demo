import { toolDefinition } from '@tanstack/ai';
import { z } from 'zod';
import { shop, toSummary } from '#lib/stores/shop.svelte.js';

const bookQueryInputSchema = z.object({
	query: z.string().meta({ description: 'The book title, or author name, to look up.' })
});

const bookLookupOutputSchema = z.object({
	found: z.boolean(),
	book: z
		.object({
			id: z.string(),
			title: z.string(),
			author: z.string(),
			price: z.number(),
			categories: z.array(z.string()),
			description: z.string()
		})
		.nullable()
});

const filterBooksDef = toolDefinition({
	name: 'filter_books',
	description:
		'Filter the visible book catalog by any combination of genres, price range, and a free-text search, and optionally sort. Only the fields you pass are changed; omit a field to leave it as-is.',
	inputSchema: z.object({
		categories: z
			.array(z.string())
			.optional()
			.meta({ description: 'Genre names to filter by, e.g. ["Fantasy","Science Fiction"]. Empty array clears the genre filter.' }),
		search: z
			.string()
			.optional()
			.meta({ description: 'Free text matched against title, author, and description. Empty string clears it.' }),
		minPrice: z.number().optional().meta({ description: 'Minimum price in USD.' }),
		maxPrice: z.number().optional().meta({ description: 'Maximum price in USD.' }),
		sort: z
			.enum(['relevance', 'price-asc', 'price-desc', 'title'])
			.optional()
			.meta({ description: 'Sort order for the results.' })
	}),
	outputSchema: z.object({
		matchCount: z.number(),
		sampleTitles: z.array(z.string()),
		activeFilters: z.array(z.string())
	})
});

const resetFiltersDef = toolDefinition({
	name: 'reset_filters',
	description: 'Clear all genre, price, and search filters and show the full catalog.',
	inputSchema: z.object({}),
	outputSchema: z.object({
		matchCount: z.number(),
		sampleTitles: z.array(z.string()),
		activeFilters: z.array(z.string())
	})
});

const openBookDef = toolDefinition({
	name: 'open_book',
	description:
		'Open the detail card for a single book identified by its title (preferred) or author. Use when the shopper asks about or wants to see a specific book.',
	inputSchema: bookQueryInputSchema,
	outputSchema: bookLookupOutputSchema
});

const closeBookDef = toolDefinition({
	name: 'close_book',
	description: 'Dismiss the currently open book detail card.',
	inputSchema: z.object({}),
	outputSchema: z.object({ closed: z.boolean() })
});

const lookupBookForContentDef = toolDefinition({
	name: 'lookup_book_for_content',
	description:
		"Look up a book by title (preferred) or author before answering a question about its plot, content, themes, or what it's about. The catalog only has a short blurb, not full content — you must answer content questions from your own knowledge of the book, and must say you don't know rather than guessing if you're not familiar with it.",
	inputSchema: bookQueryInputSchema,
	outputSchema: bookLookupOutputSchema
});

const filterBooks = filterBooksDef.client((input) => shop.applyFilters(input));
const resetFilters = resetFiltersDef.client(() => shop.reset());
const openBook = openBookDef.client(({ query }) => {
	const book = shop.findBook(query);
	shop.select(book?.id ?? null);
	return { found: book != null, book: book ? toSummary(book) : null };
});
const closeBook = closeBookDef.client(() => {
	shop.select(null);
	return { closed: true };
});
const lookupBookForContent = lookupBookForContentDef.client(({ query }) => {
	const book = shop.findBook(query);
	return { found: book != null, book: book ? toSummary(book) : null };
});

export const voiceTools = [filterBooks, resetFilters, openBook, closeBook, lookupBookForContent];
