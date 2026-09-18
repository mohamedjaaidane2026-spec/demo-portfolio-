import { useCallback, useEffect, useRef, useState } from 'react'
import TitleCard from './TitleCard'

export default function Rail({ title, items, ranked = false }) {
  const trackRef = useRef(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  const measure = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setEdge({
      start: el.scrollLeft < 8,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8,
    })
  }, [])

  useEffect(() => {
    measure()
    const el = trackRef.current
    if (!el) return undefined
    el.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      el.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [measure, items])

  const nudge = (dir) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.85, 300), behavior: 'smooth' })
  }

  if (!items?.length) return null

  return (
    <section className="mt-7">
      <div className="mb-2 flex items-center gap-3">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em]">{title}</h2>
        <span className="nums text-2xs text-fg-mute">{items.length}</span>
        <div className="ml-auto flex gap-1">
          <button
            type="button"
            onClick={() => nudge(-1)}
            disabled={edge.start}
            aria-label={`Scroll ${title} back`}
            className="btn-icon disabled:opacity-25"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            disabled={edge.end}
            aria-label={`Scroll ${title} forward`}
            className="btn-icon disabled:opacity-25"
          >
            ›
          </button>
        </div>
      </div>

      <div ref={trackRef} className="track">
        {items.map((item, i) => (
          <TitleCard key={item.id} item={item} index={ranked ? i : undefined} />
        ))}
      </div>
    </section>
  )
}
