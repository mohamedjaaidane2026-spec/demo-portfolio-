import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Poster from './Poster'
import { MetaLine } from './TitleCard'
import { useSearch } from '../lib/catalog'

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { results, loading } = useSearch(query)

  useEffect(() => {
    if (!open) return undefined
    setQuery('')
    setActive(0)
    const t = setTimeout(() => inputRef.current?.focus(), 20)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => setActive(0), [results])

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
      className="fixed inset-0 z-50 flex items-start justify-center bg-base-900/80 px-4 pt-[10vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search the catalog"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-xl border border-white/10 bg-base-850">
        <div className="flex items-center gap-2 border-b border-white/[0.07] px-3 py-2.5">
          <span className="text-fg-mute">⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search films and series…"
            className="w-full bg-transparent text-sm placeholder:text-fg-mute focus:outline-none"
          />
          {loading && <span className="text-2xs text-fg-mute">…</span>}
          <button type="button" onClick={onClose} className="text-fg-mute hover:text-fg" aria-label="Close search">
            ✕
          </button>
        </div>

        <ul className="max-h-[50vh] overflow-y-auto">
          {!loading && results.length === 0 && (
            <li className="px-3 py-6 text-center text-xs text-fg-mute">
              {query.trim() ? `No matches for “${query.trim()}”` : 'Type to search'}
            </li>
          )}
          {results.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(item.id)}
                className={`flex w-full items-center gap-3 px-3 py-2 text-left ${
                  i === active ? 'bg-white/[0.06]' : ''
                }`}
              >
                <span className="h-12 w-8 shrink-0 overflow-hidden border border-white/10">
                  <Poster item={item} sizes="32px" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px]">{item.title}</span>
                  <MetaLine item={item} className="block" />
                </span>
                {typeof item.rating === 'number' && item.rating > 0 && (
                  <span className="nums shrink-0 text-2xs text-fg-dim">
                    {item.rating.toFixed(1)}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex gap-3 border-t border-white/[0.07] px-3 py-1.5 text-2xs text-fg-mute">
          <span>↑↓ move</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  )
}
