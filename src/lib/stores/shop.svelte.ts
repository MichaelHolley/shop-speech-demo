import type { Book } from '#lib/types/book.js';
import { books } from '#lib/data/books.js';

export type SortOrder = 'relevance' | 'price-asc' | 'price-desc' | 'title';

export interface FilterInput {
	categories?: string[];
	search?: string;
	minPrice?: number;
	maxPrice?: number;
	sort?: SortOrder;
}

export interface FilterSummary {
	matchCount: number;
	sampleTitles: string[];
	activeFilters: string[];
}

export interface BookSummary {
	id: string;
	title: string;
	author: string;
	price: number;
	categories: string[];
	description: string;
}

const norm = (value: string) => value.trim().toLowerCase();

function matchCategory(bookCategories: string[], selected: string[]): boolean {
	if (selected.length === 0) return true;
	const wanted = selected.map(norm);
	return bookCategories.some((category) => wanted.includes(norm(category)));
}

function toSummary(book: Book): BookSummary {
	return {
		id: book.id,
		title: book.title,
		author: book.author,
		price: book.price,
		categories: book.categories,
		description: book.description
	};
}

class ShopStore {
	categories = $state<string[]>([]);
	search = $state('');
	minPrice = $state<number | null>(null);
	maxPrice = $state<number | null>(null);
	sort = $state<SortOrder>('relevance');
	selectedId = $state<string | null>(null);

	readonly filtered = $derived.by(() => {
		const term = norm(this.search);
		const result = books.filter((book) => {
			if (!matchCategory(book.categories, this.categories)) return false;
			if (this.minPrice != null && book.price < this.minPrice) return false;
			if (this.maxPrice != null && book.price > this.maxPrice) return false;
			if (term) {
				const haystack = `${book.title} ${book.author} ${book.description}`.toLowerCase();
				if (!haystack.includes(term)) return false;
			}
			return true;
		});

		switch (this.sort) {
			case 'price-asc':
				return result.toSorted((a, b) => a.price - b.price);
			case 'price-desc':
				return result.toSorted((a, b) => b.price - a.price);
			case 'title':
				return result.toSorted((a, b) => a.title.localeCompare(b.title));
			default:
				return result;
		}
	});

	readonly selectedBook = $derived(
		this.selectedId ? (books.find((book) => book.id === this.selectedId) ?? null) : null
	);

	readonly activeFilters = $derived.by(() => {
		const parts: string[] = [];
		if (this.categories.length) parts.push(this.categories.join(', '));
		if (this.search) parts.push(`"${this.search}"`);
		if (this.minPrice != null) parts.push(`≥ $${this.minPrice}`);
		if (this.maxPrice != null) parts.push(`≤ $${this.maxPrice}`);
		if (this.sort !== 'relevance') parts.push(`sorted by ${this.sort}`);
		return parts;
	});

	applyFilters(input: FilterInput): FilterSummary {
		if (input.categories !== undefined) this.categories = input.categories;
		if (input.search !== undefined) this.search = input.search;
		if (input.minPrice !== undefined) this.minPrice = input.minPrice;
		if (input.maxPrice !== undefined) this.maxPrice = input.maxPrice;
		if (input.sort !== undefined) this.sort = input.sort;
		return this.summary();
	}

	reset(): FilterSummary {
		this.categories = [];
		this.search = '';
		this.minPrice = null;
		this.maxPrice = null;
		this.sort = 'relevance';
		return this.summary();
	}

	toggleCategory(category: string) {
		this.categories = this.categories.includes(category)
			? this.categories.filter((entry) => entry !== category)
			: [...this.categories, category];
	}

	select(id: string | null) {
		this.selectedId = id;
	}

	findBook(queryText: string): Book | null {
		const term = norm(queryText);
		if (!term) return null;
		return (
			books.find((book) => norm(book.title) === term) ??
			books.find((book) => norm(book.title).includes(term)) ??
			books.find((book) => norm(book.author).includes(term)) ??
			null
		);
	}

	summary(): FilterSummary {
		return {
			matchCount: this.filtered.length,
			sampleTitles: this.filtered.slice(0, 8).map((book) => book.title),
			activeFilters: this.activeFilters
		};
	}
}

export const shop = new ShopStore();
export { toSummary };
