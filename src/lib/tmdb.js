// TMDB client. Reads credentials from Vite env at build time:
//
//   VITE_TMDB_TOKEN    v4 read access token (preferred, sent as a Bearer header)
//   VITE_TMDB_API_KEY  v3 API key (sent as an ?api_key= query param)
//
// If neither is set, isConfigured() returns false and the app falls back to the
// offline sample catalog in src/data/catalog.js.

const TOKEN = import.meta.env.VITE_TMDB_TOKEN?.trim()
const API_KEY = import.meta.env.VITE_TMDB_API_KEY?.trim()

const BASE = 'https://api.themoviedb.org/3'
const IMG = 'https://image.tmdb.org/t/p'

export const isConfigured = () => Boolean(TOKEN || API_KEY)

export const posterUrl = (path, size = 'w342') => (path ? `${IMG}/${size}${path}` : null)
export const backdropUrl = (path, size = 'w1280') => (path ? `${IMG}/${size}${path}` : null)

async function get(path, params = {}) {
  const url = new URL(BASE + path)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
  })

  const headers = { accept: 'application/json' }
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`
  else if (API_KEY) url.searchParams.set('api_key', API_KEY)

  const res = await fetch(url, { headers })
  if (!res.ok) {
    const detail = res.status === 401 ? ' (check your TMDB credentials)' : ''
    throw new Error(`TMDB ${res.status} on ${path}${detail}`)
  }
  return res.json()
}

// TMDB returns movies and TV with different field names; flatten both into one
// shape so components never branch on media type.
function normalize(raw, mediaType) {
  const type = mediaType || raw.media_type || (raw.title ? 'movie' : 'tv')
  const isMovie = type === 'movie'
  const date = isMovie ? raw.release_date : raw.first_air_date

  return {
    id: `${isMovie ? 'movie' : 'tv'}-${raw.id}`,
    tmdbId: raw.id,
    type: isMovie ? 'film' : 'series',
    title: (isMovie ? raw.title : raw.name) || raw.original_title || raw.original_name || 'Untitled',
    year: date ? Number(date.slice(0, 4)) : null,
    rating: typeof raw.vote_average === 'number' ? raw.vote_average : null,
    votes: raw.vote_count ?? null,
    synopsis: raw.overview || '',
    tagline: raw.tagline || '',
    poster: posterUrl(raw.poster_path),
    posterLarge: posterUrl(raw.poster_path, 'w500'),
    backdrop: backdropUrl(raw.backdrop_path),
    genres: (raw.genres || []).map((g) => g.name),
    runtime: isMovie ? raw.runtime ?? null : raw.episode_run_time?.[0] ?? null,
    seasons: isMovie ? null : raw.number_of_seasons ?? null,
    certificate: null,
    director: '',
    cast: [],
  }
}

function dedupe(items) {
  const seen = new Set()
  return items.filter((i) => {
    if (!i || seen.has(i.id)) return false
    seen.add(i.id)
    return true
  })
}

const withArtwork = (items) => dedupe(items).filter((i) => i.poster)

export async function fetchHome() {
  const [trending, movies, shows, topMovies] = await Promise.all([
    get('/trending/all/week'),
    get('/movie/popular'),
    get('/tv/popular'),
    get('/movie/top_rated'),
  ])

  const t = withArtwork((trending.results || []).map((r) => normalize(r)))

  const rows = [
    { id: 'trending', title: 'Trending this week', items: t },
    {
      id: 'movies',
      title: 'Popular films',
      items: withArtwork((movies.results || []).map((r) => normalize(r, 'movie'))),
    },
    {
      id: 'shows',
      title: 'Popular series',
      items: withArtwork((shows.results || []).map((r) => normalize(r, 'tv'))),
    },
    {
      id: 'top',
      title: 'Top rated',
      items: withArtwork((topMovies.results || []).map((r) => normalize(r, 'movie'))),
      ranked: true,
    },
  ].filter((r) => r.items.length)

  return { rows, featured: t.filter((i) => i.backdrop).slice(0, 5) }
}

export async function fetchTitle(id) {
  const [kind, tmdbId] = String(id).split('-')
  const path = kind === 'movie' ? `/movie/${tmdbId}` : `/tv/${tmdbId}`
  const raw = await get(path, { append_to_response: 'credits,release_dates,content_ratings' })
  const item = normalize(raw, kind === 'movie' ? 'movie' : 'tv')

  const crew = raw.credits?.crew || []
  item.director =
    kind === 'movie'
      ? crew.find((c) => c.job === 'Director')?.name || ''
      : (raw.created_by || []).map((c) => c.name).join(', ')
  item.cast = (raw.credits?.cast || []).slice(0, 4).map((c) => c.name)

  if (kind === 'movie') {
    const us = (raw.release_dates?.results || []).find((r) => r.iso_3166_1 === 'US')
    item.certificate = us?.release_dates?.find((d) => d.certification)?.certification || null
  } else {
    const us = (raw.content_ratings?.results || []).find((r) => r.iso_3166_1 === 'US')
    item.certificate = us?.rating || null
  }

  item.seasonList = (raw.seasons || [])
    .filter((s) => s.season_number > 0)
    .map((s) => ({
      number: s.season_number,
      name: s.name,
      episodes: s.episode_count,
      air: s.air_date ? s.air_date.slice(0, 4) : null,
    }))

  return item
}

export async function fetchRelated(id) {
  const [kind, tmdbId] = String(id).split('-')
  const path = kind === 'movie' ? `/movie/${tmdbId}/recommendations` : `/tv/${tmdbId}/recommendations`
  try {
    const data = await get(path)
    return withArtwork((data.results || []).map((r) => normalize(r))).slice(0, 12)
  } catch {
    return []
  }
}

export async function searchTitles(query) {
  if (!query.trim()) return []
  const data = await get('/search/multi', { query, include_adult: false })
  return withArtwork(
    (data.results || []).filter((r) => r.media_type !== 'person').map((r) => normalize(r))
  ).slice(0, 12)
}

export async function fetchSeasonEpisodes(id, season) {
  const [, tmdbId] = String(id).split('-')
  const data = await get(`/tv/${tmdbId}/season/${season}`)
  return (data.episodes || []).map((e) => ({
    number: e.episode_number,
    title: e.name,
    runtime: e.runtime,
    synopsis: e.overview,
    still: e.still_path ? `${IMG}/w300${e.still_path}` : null,
  }))
}
