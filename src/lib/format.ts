import type { Book } from '#lib/types/book.js';

export function callNumber({ categories, author }: Book) {
	const words = (categories[0] ?? '').split(/[\s-]+/).filter(Boolean);
	const prefix = words.length > 1 ? words.map((word) => word[0]).join('') : words[0]?.slice(0, 2);
	const surname = author.trim().split(/\s+/).at(-1) ?? '';
	return `${prefix ?? '??'}/${surname.slice(0, 3)}`.toUpperCase();
}

export function filingName(author: string) {
	const parts = author.trim().split(/\s+/);
	return parts.length > 1 ? `${parts.at(-1)}, ${parts.slice(0, -1).join(' ')}` : author;
}

export function shelfPrice(price: number) {
	return `${price.toFixed(2)} USD`;
}
