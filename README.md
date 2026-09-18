# Syncroom

A watch-along streaming client built with **React**, **Vite** and **Tailwind CSS**. Browse a
catalog, save titles to a list, and open a synced room with timestamped chat beside the picture.

The interface is an original design, deliberately dense and utilitarian: a compact top bar,
near-monochrome neutrals with a single red accent, no decorative gradients or glows, tabular
figures for ratings and timecodes, and tight poster grids that put as much of the catalog on
screen as possible.

## Features

- **Home** — featured hero, continue-watching row, and horizontal rails with edge-aware scroll
  buttons and loading skeletons
- **Browse** — filter by type and genre, sort by rating, year or title
- **Title detail** — synopsis, credits, certification, progress, and a season-by-season episode
  list loaded on demand
- **Sync room** — mock player with a ticking playhead, scrubber, member avatars, and working chat
  whose timestamps follow the playhead
- **My list** — watchlist and watch history, persisted to `localStorage`
- **Command palette search** — `⌘K` / `Ctrl+K` or `/`, with arrow-key navigation
- Responsive down to mobile, keyboard accessible, with a skip link and labelled controls

## Catalog data

The catalog comes from [TMDB](https://www.themoviedb.org/). Provide one credential:

```bash
cp .env.example .env
# then set ONE of:
#   VITE_TMDB_TOKEN=...    v4 read access token (preferred)
#   VITE_TMDB_API_KEY=...  v3 API key
```

Both are free from themoviedb.org → Settings → API. `src/lib/tmdb.js` normalizes
movie and TV responses into a single shape so components never branch on media type.

Without credentials the app still boots: `src/lib/catalog.jsx` falls back to a small
sample set in `src/data/catalog.js` and a dismissible banner explains what's missing.
Titles with no artwork render a neutral "no artwork" tile rather than a fabricated image.

**Use your own key.** Don't lift one out of another site's JS bundle — TMDB keys are
tied to the account that registered them.

## Running locally

```bash
npm install
npm run dev     # http://localhost:3000
```

Other scripts:

```bash
npm run build   # production build to dist/
npm run preview # serve the production build
```

## Running in Alloy

The repo ships an Alloy setup: `docker-compose.alloy.yaml` (single `web` service on
`network_mode: host`) and `.alloy/environment.json` pointing at port `3000`.

```bash
docker compose -f docker-compose.alloy.yaml up
```

## Project structure

```
src/
  components/   Layout, Hero, Rail, TitleCard, SearchOverlay
  pages/        Home, Browse, TitleDetail, Watch, Account (Library + Rooms)
  lib/          tmdb.js (API client), catalog.jsx (providers/hooks), store.jsx
  data/         catalog.js (offline sample data)
```
