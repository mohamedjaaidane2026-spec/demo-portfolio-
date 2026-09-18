import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Artwork from '../lib/Artwork'
import { IconArrow, IconCheck, IconPlay, IconPlus, IconStar, IconUsers } from '../lib/icons'
import { useStore } from '../lib/store'

export default function Hero({ items }) {
  const [i, setI] = useState(0)
  const { inWatchlist, toggleWatchlist } = useStore()

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % items.length), 9000)
    return () => clearInterval(t)
  }, [items.length])

  const item = items[i]
  const saved = inWatchlist(item.id)

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Artwork key={item.id} item={item} variant="wide" className="h-full w-full animate-fade-in" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/15 to-ink-950/35" />
      </div>

      <div className="shell relative grid items-end gap-10 pb-10 pt-14 sm:pb-14 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div key={item.id} className="max-w-2xl animate-fade-up">
          <p className="eyebrow">
            Featured · {item.type === 'series' ? 'Series' : 'Film'} · {item.genres.join(' / ')}
          </p>

          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.04] tracking-tight text-balance sm:text-5xl lg:text-[58px]">
            {item.title}
          </h1>

          <p className="mt-3 font-display text-lg italic text-teal-300/90">{item.tagline}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-mist-300">
            <span className="inline-flex items-center gap-1.5 font-semibold text-amber-300">
              <IconStar size={14} />
              {item.rating.toFixed(1)}
            </span>
            <span>{item.year}</span>
            <span className="rounded border border-white/20 px-1.5 py-px text-[11px] font-semibold">
              {item.certificate}
            </span>
            <span>
              {item.type === 'series'
                ? `${item.seasons} season${item.seasons > 1 ? 's' : ''} · ${item.runtime} min episodes`
                : `${item.runtime} min`}
            </span>
          </div>

          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-mist-300">{item.synopsis}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to={`/watch/${item.id}`} className="btn-primary px-6 py-3">
              <IconPlay size={16} />
              Play now
            </Link>
            <Link to={`/rooms?title=${item.id}`} className="btn-ghost px-6 py-3">
              <IconUsers size={16} />
              Watch with friends
            </Link>
            <button
              type="button"
              onClick={() => toggleWatchlist(item.id)}
              aria-pressed={saved}
              className={`btn h-[46px] w-[46px] border ${
                saved
                  ? 'border-teal-400/60 bg-teal-400/15 text-teal-300'
                  : 'border-white/[0.12] bg-white/[0.04] text-mist-300 hover:border-white/30 hover:text-white'
              }`}
              aria-label={saved ? 'Remove from My list' : 'Add to My list'}
            >
              {saved ? <IconCheck size={18} /> : <IconPlus size={18} />}
            </button>
          </div>

          <Link
            to={`/title/${item.id}`}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-mist-300 hover:text-teal-300"
          >
            Full details
            <IconArrow size={15} />
          </Link>
        </div>

        <aside className="panel hidden p-5 lg:block">
          <p className="eyebrow">Up next in featured</p>
          <ul className="mt-4 space-y-1">
            {items.map((t, n) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setI(n)}
                  aria-current={n === i}
                  className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors duration-200 ${
                    n === i ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="h-12 w-8 shrink-0 overflow-hidden rounded border border-white/10">
                    <Artwork item={t} className="h-full w-full" />
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block truncate text-sm font-semibold ${
                        n === i ? 'text-teal-300' : 'text-mist-100'
                      }`}
                    >
                      {t.title}
                    </span>
                    <span className="block truncate text-[11px] text-mist-500">
                      {t.year} · {t.genres[0]}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-1.5 border-t border-white/[0.07] pt-4">
            {items.map((t, n) => (
              <span
                key={t.id}
                className={`h-1 flex-1 rounded-full ${n === i ? 'bg-teal-400' : 'bg-white/[0.12]'}`}
              />
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
