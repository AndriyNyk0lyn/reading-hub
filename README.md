## Offline Reading Hub

Offline Reading Hub is a Progressive Web App that fetches the latest Dev.to
articles, lets you search/filter them, and save any story for fully offline
reading. It demonstrates installability, service-worker driven caching, and
IndexedDB persistence powered by Dexie.

### Tech stack

- Next.js App Router + React 19 + TypeScript
- Shadcn UI + Tailwind CSS 4
- TanStack Query for API caching
- Dexie + IndexedDB for offline storage
- Custom service worker + Web App Manifest for PWA features

## Getting started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Add your Dev.to API key so the server routes can authenticate (read-only
   requests still work without a key, but rate limits are higher with one).
   Create a `.env.local` file:

   ```ini
   DEVTO_API_KEY=replace_me
   ```

3. Run the dev server:

   ```bash
   pnpm dev
   ```

4. Open http://localhost:3000. Use the browser's “Install app” option to install
   the PWA and test it offline by visiting `/saved` or `/offline`.

## Available scripts

| Script        | Description                                    |
| ------------- | ---------------------------------------------- |
| `pnpm dev`    | Starts the Next.js dev server                  |
| `pnpm build`  | Builds the production bundle                   |
| `pnpm start`  | Runs the production server                     |
| `pnpm lint`   | Runs ESLint across the project                 |

## Feature checklist

- [x] Real Dev.to feed with search + tag filters
- [x] IndexedDB-powered offline library to save/remove articles
- [x] Article detail view that prefers offline data and falls back to API
- [x] Installable manifest + icons + custom service worker with caching
- [x] Dedicated offline fallback route

## Testing offline support

1. Run `pnpm build` and `pnpm start` for a production-like environment.
2. Visit the site, open DevTools → Application → Service Workers to confirm
   registration.
3. Use DevTools → Network → Offline to simulate loss of network and refresh.
   The feed shows cached data (if available) and `/offline` acts as the fallback.
4. Saved articles remain accessible because their content is stored in
   IndexedDB.

## Deployment notes

- The service worker and manifest live in `public/ sw.js` and
  `public/manifest.webmanifest` and require HTTPS in production.
- Remember to set `DEVTO_API_KEY` in your deployment environment for higher
  rate limits.
