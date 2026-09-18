# Syncroom

A watch-along streaming client built with **React**, **Vite** and **Tailwind CSS**. Browse a
catalog, save titles to a list, and open a synced room with timestamped chat beside the picture.

The product concept was inspired by a watch-along app, but the interface here is an original
design: a labelled top navigation instead of an icon rail, a deep indigo/slate base with a single
teal accent, serif display type for titles, and cover art that is generated in code rather than
fetched from a media database.

## Features

- **Home** — rotating featured hero, continue-watching row, live-room strip, and five horizontal
  rails with edge-aware scroll buttons
- **Browse** — filter by type and genre, sort by popularity, rating, year or title
- **Title detail** — synopsis, credits, progress, and an episode list for series
- **Sync room** — mock player with a ticking playhead, scrubber, member avatars, and working chat
  whose timestamps follow the playhead
- **My list** — watchlist and watch history, persisted to `localStorage`
- **Command palette search** — `⌘K` / `Ctrl+K` or `/`, with arrow-key navigation
- Responsive down to mobile, keyboard accessible, with a skip link and labelled controls

## Cover art

There are no third-party image assets. `src/lib/Artwork.jsx` hashes each title's id into a seeded
PRNG and composes an SVG — graded sky, ridge silhouettes, a glowing light source, and drifting
particles — so every title gets a distinct, deterministic cover in both portrait and wide crops.

## Catalog data

`src/data/catalog.js` holds an invented catalog of 18 films and series (titles, synopses, credits
and palettes) so the app runs with no API keys or network access.

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
  lib/          Artwork generator, icon set, watchlist/progress store
  data/         catalog.js
```
