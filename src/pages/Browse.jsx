import { useMemo, useState } from 'react'
import TitleCard from '../components/TitleCard'
import { CATALOG, GENRES } from '../data/catalog'

const TYPES = [
  { id: 'all', label: 'Everything' },
  { id: 'film', label: 'Films' },
  { id: 'series', label: 'Series' },
]

const SORTS = [
  { id: 'popular', label: 'Most popular' },
  { id: 'rating', label: 'Highest rated' },
  { id: 'newest', label: 'Newest first' },
  { id: 'az', label: 'A–Z' },
]

export default function Browse() {
  const [type, setType] = useState('all')
  const [genre, setGenre] = useState('all')
  const [sort, setSort] = useState('popular')

  const results = useMemo(() => {
    let list = CATALOG.filter(
      (t) => (type === 'all' || t.type === type) && (genre === 'all' || t.genres.includes(genre))
    )
    const sorters = {
      popular: (a, b) => b.popularity - a.popularity,
      rating: (a, b) => b.rating - a.rating,
      newest: (a, b) => b.year - a.year,
      az: (a, b) => a.title.localeCompare(b.title),
    }
    return [...list].sort(sorters[sort])
  }, [type, genre, sort])

  return (
    <div className="shell py-12">
      <header className="max-w-2xl">
        <p className="eyebrow">Catalog</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">Browse</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-mist-400">
          {CATALOG.length} titles, filtered however you like. Add anything to your list and it
          appears in every room you host.
        </p>
      </header>

      <div className="panel mt-9 flex flex-col gap-5 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-[0.18em] text-mist-500">
            Type
          </span>
          {TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setType(t.id)}
              aria-pressed={type === t.id}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ${
                type === t.id
                  ? 'bg-teal-400 text-ink-950'
                  : 'border border-white/10 bg-white/[0.04] text-mist-400 hover:text-mist-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-5">
          <span className="mr-1 text-xs font-semibold uppercase tracking-[0.18em] text-mist-500">
            Genre
          </span>
          {['all', ...GENRES].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGenre(g)}
              aria-pressed={genre === g}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ${
                genre === g
                  ? 'border border-teal-400/60 bg-teal-400/15 text-teal-300'
                  : 'border border-white/10 bg-white/[0.04] text-mist-400 hover:text-mist-100'
              }`}
            >
              {g === 'all' ? 'All genres' : g}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-5">
          <p className="text-sm text-mist-400">
            <span className="font-semibold text-mist-100">{results.length}</span>{' '}
            {results.length === 1 ? 'title' : 'titles'}
          </p>
          <label className="flex items-center gap-2 text-sm text-mist-400">
            Sort by
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-white/10 bg-ink-800 px-3 py-1.5 text-sm font-medium text-mist-100"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="panel mt-8 p-10 text-center text-sm text-mist-400">
          No titles match that combination yet. Try clearing the genre filter.
        </p>
      ) : (
        <div className="mt-9 flex flex-wrap gap-5">
          {results.map((item) => (
            <TitleCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
