import { query } from '$app/server';
import { books } from '#lib/data/books.js';

export const getBooks = query(() => books);
