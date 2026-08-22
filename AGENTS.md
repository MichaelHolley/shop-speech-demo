## Project Configuration

- SvelteKit using runes, remote-functions
- TypeScript
- Tailwindcss

This is a **demo app** — build at proof-of-concept level. Favor the simplest thing that works and demonstrates the idea; skip production concerns like hardening, exhaustive error handling, auth, scalability, and edge-case coverage unless explicitly asked.

## Tanstack AI

When working on TanStack AI code, read and follow:
node_modules/@tanstack/ai/skills/ai-core/SKILL.md

## Architecture

Voice-driven bookshop. The shopper talks; an AI concierge filters/navigates via tools and speaks back.

- **Voice**: OpenAI Realtime (`gpt-realtime`, voice-to-voice over WebRTC) — STT + reasoning + TTS. OpenRouter has no realtime adapter and is unused; do not route the conversation through it.
- **Server**: `src/routes/api/realtime-token/+server.ts` mints ephemeral tokens with `realtimeToken` + `openaiRealtimeToken`. `OPENAI_API_KEY` is server-only, read via `$app/env/private` (declared in `src/env.ts`; `$env/*` is deprecated in this Kit).
- **Client**: `src/lib/ai/realtime.svelte.ts` wraps `RealtimeClient` (from `@tanstack/ai-client`) in a rune — there is no Svelte realtime hook.
- **Tools**: `src/lib/ai/tools.ts` — isomorphic, zod-typed, client-side; they mutate the filter store. Prompt in `src/lib/ai/instructions.ts`.
- **State**: `src/lib/stores/shop.svelte.ts` (rune store, `$derived` results). Catalog in `src/lib/data/books.ts` (single source of truth).

## Git

Use conventional commit messages like 'feat:', 'fix:', 'chore:', ...

## Feedback Loop

Use `package.json` scripts over `pnpx` and `npx` commands.
Validate your changes with `pnpm run check`.

## Documentation

- Only add a comment when complexity is genuinely high **and** the naming does not already convey enough information.
- A comment that restates the function name, parameters, or return type is worthless — delete it. Well-named identifiers are the documentation.
- Never add a comment just because a function is public or exported.
- When a comment truly is warranted, prefer explaining _why_ over _what_, use JSDoc syntax, and keep it short and concise.

---

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available Svelte MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
