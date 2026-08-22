# Bookshop — Voice Concierge

A SvelteKit bookshop you browse by talking to it. A realtime voice assistant
navigates the storefront on your behalf: applying genre/price/search filters,
sorting, and opening book details — and talks back.

Built with [TanStack AI](https://tanstack.com/ai) + **OpenAI Realtime**
(`gpt-realtime`, voice-to-voice over WebRTC). Filtering runs client-side through
isomorphic tools the model calls.

## Setup

Set your OpenAI key (used server-side to mint short-lived session tokens; it
never reaches the browser):

```sh
cp .env.example .env
# edit .env → OPENAI_API_KEY=sk-...
```

## Develop

```sh
pnpm install
pnpm run dev
```

Open the app, click **Talk to concierge**, allow the microphone, and say
something like *"show me fantasy books under 15 dollars"* or *"tell me about Dune"*.

## Validate

```sh
pnpm run check
```

## Build

```sh
pnpm run build && pnpm run preview
```

> Deploying requires an [adapter](https://svelte.dev/docs/kit/adapters) for your target.
