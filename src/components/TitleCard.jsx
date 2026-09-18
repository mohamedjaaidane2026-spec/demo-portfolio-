import { Link } from 'react-router-dom'
import Artwork from '../lib/Artwork'
import { IconCheck, IconPlay, IconPlus, IconStar } from '../lib/icons'
import { useStore } from '../lib/store'

export function Meta({ item, className = '' }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-mist-400 ${className}`}>
      <span className="inline-flex items-center gap-1 font-semibold text-amber-300">
        <IconStar size={12} />
        {item.rating.toFixed(1)}
      </span>
      <span>{item.year}</span>
      <span className="rounded border border-white/15 px-1.5 py-px text-[10px] font-semibold tracking-wide">
        {item.certificate}
      </span>
      <span>
        {item.type === 'series'
          ? `${item.seasons} season${item.seasons > 1 ? 's' : ''}`
          : `${item.runtime} min`}
      </span>
    </div>
  )
}

export default function TitleCard({ item, index, showProgress = false }) {
  const { inWatchlist, toggleWatchlist, progress } = useStore()
  const saved = inWatchlist(item.id)
  const p = progress[item.id]

  return (
    <article className="group relative w-[190px] shrink-0 snap-start sm:w-[210px]">
      <Link
        to={`/title/${item.id}`}
        className="block overflow-hidden rounded-xl border border-white/[0.08] bg-ink-850 shadow-lift transition-colors duration-300 group-hover:border-teal-400/45"
      >
        <div className="relative aspect-[2/3]">
          <Artwork item={item} className="h-full w-full" />

          <div className="absolute inset-x-0 bottom-0 p-3">
            <p className="font-display text-[17px] font-semibold leading-tight text-balance text-white drop-shadow">
              {item.title}
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-mist-400">
              {item.type === 'series' ? 'Series' : 'Film'} · {item.genres[0]}
            </p>
          </div>

          <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-ink-950/80 px-2 py-0.5 text-[11px] font-semibold text-amber-300 backdrop-blur">
            <IconStar size={11} />
            {item.rating.toFixed(1)}
          </div>

          {typeof index === 'number' && (
            <span className="absolute right-2 top-2 font-display text-2xl font-bold text-white/25">
              {String(index + 1).padStart(2, '0')}
            </span>
          )}

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink-950/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-teal-400 text-ink-950">
              <IconPlay size={18} />
            </span>
          </div>
        </div>

        {showProgress && p && (
          <div className="px-3 pb-3 pt-2">
            <div className="h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-teal-400"
                style={{ width: `${Math.round(p.value * 100)}%` }}
              />
            </div>
            <p className="mt-1.5 truncate text-[11px] text-mist-500">{p.label}</p>
          </div>
        )}
      </Link>

      <button
        type="button"
        onClick={() => toggleWatchlist(item.id)}
        aria-label={saved ? `Remove ${item.title} from My list` : `Add ${item.title} to My list`}
        aria-pressed={saved}
        className={`absolute right-2 top-11 inline-flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur transition-colors duration-200 ${
          saved
            ? 'border-teal-400/60 bg-teal-400/20 text-teal-300'
            : 'border-white/15 bg-ink-950/70 text-mist-300 opacity-0 hover:border-white/35 hover:text-white group-hover:opacity-100 focus-visible:opacity-100'
        }`}
      >
        {saved ? <IconCheck size={15} /> : <IconPlus size={15} />}
      </button>
    </article>
  )
}
