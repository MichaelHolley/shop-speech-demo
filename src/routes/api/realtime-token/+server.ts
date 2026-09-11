import { json, error } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$app/env/private';
import { realtimeToken } from '@tanstack/ai';
import { openaiRealtimeToken } from '@tanstack/ai-openai';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
	if (!OPENAI_API_KEY) {
		error(500, 'OPENAI_API_KEY is not set. Add it to your .env file and restart the dev server.');
	}

	// The OpenAI token adapter reads the key from process.env at construction;
	// bridge it from SvelteKit's private env so it works without extra setup.
	process.env.OPENAI_API_KEY = OPENAI_API_KEY;

	try {
		const token = await realtimeToken({
			// @ts-expect-error TanStack AI has not added this OpenAI model yet.
			adapter: openaiRealtimeToken({ model: 'gpt-realtime-2.1-mini' })
		});
		return json(token);
	} catch (err) {
		error(502, err instanceof Error ? err.message : 'Failed to mint realtime token');
	}
};
