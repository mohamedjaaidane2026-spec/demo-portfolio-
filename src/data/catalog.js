// Offline sample catalog. Used only when no TMDB credentials are configured, so
// the UI has something to render during local development. Shape matches the
// normalized objects produced by src/lib/tmdb.js. No artwork — the Poster
// component renders a neutral "no artwork" tile for these.

const sample = [
  {
    id: 'sample-1',
    type: 'film',
    title: 'Sample Feature',
    year: 2024,
    rating: 7.8,
    votes: 1240,
    certificate: 'PG-13',
    runtime: 118,
    genres: ['Drama'],
    synopsis:
      'Placeholder entry shown because TMDB credentials are not configured. Add VITE_TMDB_TOKEN or VITE_TMDB_API_KEY to load the real catalog.',
  },
  {
    id: 'sample-2',
    type: 'series',
    title: 'Sample Series',
    year: 2025,
    rating: 8.1,
    votes: 890,
    certificate: 'TV-MA',
    runtime: 52,
    seasons: 2,
    genres: ['Thriller'],
    synopsis:
      'Placeholder entry shown because TMDB credentials are not configured. Add VITE_TMDB_TOKEN or VITE_TMDB_API_KEY to load the real catalog.',
  },
  {
    id: 'sample-3',
    type: 'film',
    title: 'Sample Documentary',
    year: 2023,
    rating: 7.2,
    votes: 410,
    certificate: 'PG',
    runtime: 94,
    genres: ['Documentary'],
    synopsis:
      'Placeholder entry shown because TMDB credentials are not configured. Add VITE_TMDB_TOKEN or VITE_TMDB_API_KEY to load the real catalog.',
  },
  {
    id: 'sample-4',
    type: 'series',
    title: 'Sample Anthology',
    year: 2026,
    rating: 7.5,
    votes: 205,
    certificate: 'TV-14',
    runtime: 34,
    seasons: 1,
    genres: ['Sci-Fi'],
    synopsis:
      'Placeholder entry shown because TMDB credentials are not configured. Add VITE_TMDB_TOKEN or VITE_TMDB_API_KEY to load the real catalog.',
  },
  {
    id: 'sample-5',
    type: 'film',
    title: 'Sample Comedy',
    year: 2022,
    rating: 6.9,
    votes: 1580,
    certificate: 'R',
    runtime: 101,
    genres: ['Comedy'],
    synopsis:
      'Placeholder entry shown because TMDB credentials are not configured. Add VITE_TMDB_TOKEN or VITE_TMDB_API_KEY to load the real catalog.',
  },
  {
    id: 'sample-6',
    type: 'series',
    title: 'Sample Procedural',
    year: 2021,
    rating: 7.0,
    votes: 2210,
    certificate: 'TV-14',
    runtime: 45,
    seasons: 4,
    genres: ['Crime'],
    synopsis:
      'Placeholder entry shown because TMDB credentials are not configured. Add VITE_TMDB_TOKEN or VITE_TMDB_API_KEY to load the real catalog.',
  },
]

const FALLBACK = sample.map((s) => ({
  tagline: '',
  poster: null,
  posterLarge: null,
  backdrop: null,
  director: '',
  cast: [],
  seasons: null,
  ...s,
}))

export const FALLBACK_CATALOG = FALLBACK

export const FALLBACK_FEATURED = FALLBACK.slice(0, 3)

export const FALLBACK_ROWS = [
  { id: 'trending', title: 'Trending this week', items: FALLBACK },
  { id: 'movies', title: 'Popular films', items: FALLBACK.filter((i) => i.type === 'film') },
  { id: 'shows', title: 'Popular series', items: FALLBACK.filter((i) => i.type === 'series') },
  {
    id: 'top',
    title: 'Top rated',
    items: [...FALLBACK].sort((a, b) => b.rating - a.rating),
    ranked: true,
  },
]

export const findFallback = (id) => FALLBACK.find((i) => i.id === id) || null

export function searchFallback(query) {
  const q = query.trim().toLowerCase()
  if (!q) return FALLBACK.slice(0, 8)
  return FALLBACK.filter(
    (i) => i.title.toLowerCase().includes(q) || i.genres.some((g) => g.toLowerCase().includes(q))
  )
}
