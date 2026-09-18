import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATALOG } from '../data/catalog'
import Artwork from '../lib/Artwork'
import { IconClose, IconSearch } from '../lib/icons'

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      const t = setTimeout(() => inputRef.current?.focus(), 30)
      return () => clearTimeout(t)
    }
    return undefined
  }, [open])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const pool = q
      ? CATALOG.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.genres.some((g) => g.toLowerCase().includes(q)) ||
            t.director.toLowerCase().includes(q)
        )
      : [...CATALOG].sort((a, b) => b.popularity - a.popularity)
    return pool.slice(0, 7)
  }, [query])

  if (!open) return null

  const go = (id) => {
    onClose()
    navigate(`/title/${id}`)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[active]) {
      go(results[active].id)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-start justify-center bg-ink-950/85 px-4 pt-[12vh] backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Search the catalog"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-ink-900/95 shadow-lift">
        <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-4">
          <span className="text-teal-300">
            <IconSearch size={19} />
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
            placeholder="Search titles, genres, directors…"
            className="w-full bg-transparent text-[15px] text-mist-100 placeholder:text-mist-500 focus:outline-none"
          />
          <button type="button" onClick={onClose} className="btn-quiet" aria-label="Close search">
            <IconClose size={17} />
          </button>
        </div>

        <ul className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-mist-500">
              Nothing matched “{query}”. Try a genre like Thriller or Animation.
            </li>
          )}
          {results.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(item.id)}
                className={`flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-left transition-colors duration-150 ${
                  i === active ? 'bg-white/[0.07]' : 'hover:bg-white/[0.04]'
                }`}
              >
                <span className="h-14 w-10 shrink-0 overflow-hidden rounded-md border border-white/10">
                  <Artwork item={item} className="h-full w-full" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-mist-100">
                    {item.title}
                  </span>
                  <span className="block truncate text-xs text-mist-500">
                    {item.type === 'series' ? 'Series' : 'Film'} · {item.year} ·{' '}
                    {item.genres.join(', ')}
                  </span>
                </span>
                <span className="shrink-0 text-xs font-semibold text-amber-300">
                  {item.rating.toFixed(1)}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 border-t border-white/[0.07] px-5 py-3 text-[11px] text-mist-500">
          <span>
            <kbd className="rounded border border-white/15 px-1.5 py-0.5">↑</kbd>{' '}
            <kbd className="rounded border border-white/15 px-1.5 py-0.5">↓</kbd> navigate
          </span>
          <span>
            <kbd className="rounded border border-white/15 px-1.5 py-0.5">↵</kbd> open
          </span>
          <span>
            <kbd className="rounded border border-white/15 px-1.5 py-0.5">esc</kbd> dismiss
          </span>
        </div>
      </div>
    </div>
  )
}
