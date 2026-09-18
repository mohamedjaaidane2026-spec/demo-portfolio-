import { useCallback, useEffect, useRef, useState } from 'react'
import TitleCard from './TitleCard'
import { IconChevron } from '../lib/icons'

export default function Rail({ title, caption, items, ranked = false, showProgress = false }) {
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
  }, [measure])

  const nudge = (dir) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 320), behavior: 'smooth' })
  }

  if (!items.length) return null

  return (
    <section className="py-7">
      <div className="shell flex items-end justify-between gap-6">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-[26px]">{title}</h2>
          {caption && <p className="mt-1 text-sm text-mist-500">{caption}</p>}
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          {[-1, 1].map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => nudge(dir)}
              disabled={dir === -1 ? edge.start : edge.end}
              aria-label={dir === -1 ? `Scroll ${title} back` : `Scroll ${title} forward`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] text-mist-300 transition-colors duration-200 hover:border-teal-400/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/[0.12] disabled:hover:text-mist-300"
            >
              <span className={dir === -1 ? 'rotate-180' : ''}>
                <IconChevron size={16} />
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-5">
        <div ref={trackRef} className={`rail-scroll shell ${edge.end ? '' : 'sm:mask-fade-r'}`}>
          {items.map((item, i) => (
            <TitleCard
              key={`${title}-${item.id}`}
              item={item}
              index={ranked ? i : undefined}
              showProgress={showProgress}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
