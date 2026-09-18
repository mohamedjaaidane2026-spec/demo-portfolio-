import { Link } from 'react-router-dom'
import Poster from './Poster'
import { useStore } from '../lib/store'

export function Rating({ value, className = '' }) {
  if (typeof value !== 'number') return null
  return <span className={`nums font-medium ${className}`}>{value.toFixed(1)}</span>
}

export function MetaLine({ item, className = '' }) {
  const bits = [
    item.year,
    item.type === 'series'
      ? item.seasons
        ? `${item.seasons} season${item.seasons > 1 ? 's' : ''}`
        : 'Series'
      : item.runtime
        ? `${item.runtime} min`
        : 'Film',
    item.certificate,
  ].filter(Boolean)

  return (
    <span className={`nums text-2xs text-fg-mute ${className}`}>{bits.join('  ·  ')}</span>
  )
}

export default function TitleCard({ item, index, width = 'w-[132px] sm:w-[146px]' }) {
  const { inWatchlist, toggleWatchlist, progress } = useStore()
  const saved = inWatchlist(item.id)
  const p = progress[item.id]

  return (
    <article className={`group relative shrink-0 ${width}`}>
      <Link to={`/title/${item.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden border border-white/[0.07] bg-base-800">
          <Poster item={item} sizes="146px" />

          {typeof index === 'number' && (
            <span className="nums absolute left-0 top-0 bg-base-900/85 px-1.5 py-0.5 text-2xs font-semibold text-fg-dim">
              {index + 1}
            </span>
          )}

          {typeof item.rating === 'number' && item.rating > 0 && (
            <span className="nums absolute bottom-0 right-0 bg-base-900/85 px-1.5 py-0.5 text-2xs font-medium">
              {item.rating.toFixed(1)}
            </span>
          )}

          <span className="absolute inset-0 border border-transparent transition-colors duration-150 group-hover:border-fg/50" />

          {p && p.value > 0 && p.value < 1 && (
            <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white/15">
              <span
                className="block h-full bg-accent"
                style={{ width: `${Math.round(p.value * 100)}%` }}
              />
            </span>
          )}
        </div>

        <div className="mt-1.5">
          <h3 className="truncate text-[13px] leading-tight text-fg-dim group-hover:text-fg">
            {item.title}
          </h3>
          <MetaLine item={item} className="mt-0.5 block" />
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleWatchlist(item.id)}
        aria-label={saved ? `Remove ${item.title} from list` : `Add ${item.title} to list`}
        aria-pressed={saved}
        className={`absolute right-0 top-0 h-6 w-6 text-sm leading-none transition-opacity duration-150 ${
          saved
            ? 'bg-accent text-white'
            : 'bg-base-900/85 text-fg-dim opacity-0 hover:text-fg group-hover:opacity-100 focus-visible:opacity-100'
        }`}
      >
        {saved ? '✓' : '+'}
      </button>
    </article>
  )
}
