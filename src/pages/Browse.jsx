import { useMemo, useState } from 'react'
import TitleCard from '../components/TitleCard'
import { useCatalog } from '../lib/catalog'

const TYPES = [
  { id: 'all', label: 'All' },
  { id: 'film', label: 'Films' },
  { id: 'series', label: 'Series' },
]

const SORTS = [
  { id: 'default', label: 'Relevance' },
  { id: 'rating', label: 'Rating' },
  { id: 'year', label: 'Newest' },
  { id: 'az', label: 'A–Z' },
]

export default function Browse() {
  const { rows, loading } = useCatalog()
  const [type, setType] = useState('all')
  const [genre, setGenre] = useState('all')
  const [sort, setSort] = useState('default')

  // Flatten every row into one de-duplicated pool.
  const pool = useMemo(() => {
    const seen = new Map()
    rows.forEach((row) => row.items.forEach((i) => !seen.has(i.id) && seen.set(i.id, i)))
    return [...seen.values()]
  }, [rows])

  const genres = useMemo(() => {
    const set = new Set()
    pool.forEach((i) => i.genres?.forEach((g) => set.add(g)))
    return [...set].sort()
  }, [pool])

  const results = useMemo(() => {
    const list = pool.filter(
      (i) =>
        (type === 'all' || i.type === type) && (genre === 'all' || i.genres?.includes(genre))
    )
    const sorters = {
      default: () => 0,
      rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
      year: (a, b) => (b.year ?? 0) - (a.year ?? 0),
      az: (a, b) => a.title.localeCompare(b.title),
    }
    return sort === 'default' ? list : [...list].sort(sorters[sort])
  }, [pool, type, genre, sort])

  return (
    <div className="shell py-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-white/[0.07] pb-3">
        <h1 className="text-[13px] font-semibold uppercase tracking-[0.1em]">Browse</h1>

        <div className="flex gap-0.5">
          {TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setType(t.id)}
              aria-pressed={type === t.id}
              className={`px-2 py-1 text-xs ${
                type === t.id ? 'bg-fg text-base-900' : 'text-fg-mute hover:text-fg-dim'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-1.5 text-xs text-fg-mute">
          Genre
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="border border-white/10 bg-base-850 px-1.5 py-1 text-xs text-fg"
          >
            <option value="all">All</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-1.5 text-xs text-fg-mute">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-white/10 bg-base-850 px-1.5 py-1 text-xs text-fg"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <span className="nums ml-auto text-2xs text-fg-mute">
          {loading ? 'loading…' : `${results.length} titles`}
        </span>
      </div>

      {loading ? (
        <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(132px,1fr))] gap-2">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[2/3] bg-base-800" />
              <div className="mt-1.5 h-3 w-4/5 bg-base-800" />
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <p className="mt-8 text-center text-xs text-fg-mute">
          Nothing matches those filters.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(132px,1fr))] gap-2">
          {results.map((item) => (
            <TitleCard key={item.id} item={item} width="w-full" />
          ))}
        </div>
      )}
    </div>
  )
}
