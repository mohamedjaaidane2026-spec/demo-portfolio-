import { Link } from 'react-router-dom'
import Poster from './Poster'
import { Rating } from './TitleCard'
import { useStore } from '../lib/store'

export default function Hero({ item }) {
  const { inWatchlist, toggleWatchlist } = useStore()
  if (!item) return null
  const saved = inWatchlist(item.id)

  return (
    <section className="relative border-b border-white/[0.07]">
      {item.backdrop && (
        <div className="absolute inset-0">
          <img
            src={item.backdrop}
            alt=""
            className="h-full w-full object-cover object-top opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-base-900 via-base-900/80 to-base-900/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-base-900 to-transparent" />
        </div>
      )}

      <div className="shell relative flex gap-6 py-8">
        <div className="hidden w-[132px] shrink-0 border border-white/10 sm:block">
          <div className="aspect-[2/3]">
            <Poster item={item} src={item.posterLarge || item.poster} sizes="132px" />
          </div>
        </div>

        <div className="min-w-0 max-w-2xl">
          <p className="label">
            Featured · {item.type === 'series' ? 'Series' : 'Film'}
            {item.genres?.length ? ` · ${item.genres.slice(0, 2).join(', ')}` : ''}
          </p>

          <h1 className="mt-1.5 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
            {item.title}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-dim">
            {typeof item.rating === 'number' && item.rating > 0 && (
              <span className="flex items-baseline gap-1">
                <Rating value={item.rating} className="text-fg" />
                <span className="text-fg-mute">/10</span>
                {item.votes ? (
                  <span className="nums text-fg-mute">({item.votes.toLocaleString()})</span>
                ) : null}
              </span>
            )}
            {item.year && <span className="nums">{item.year}</span>}
            {item.certificate && <span className="tag">{item.certificate}</span>}
            {item.type === 'series'
              ? item.seasons && (
                  <span className="nums">
                    {item.seasons} season{item.seasons > 1 ? 's' : ''}
                  </span>
                )
              : item.runtime && <span className="nums">{item.runtime} min</span>}
          </div>

          {item.synopsis && (
            <p className="mt-3 line-clamp-3 max-w-xl text-[13px] leading-relaxed text-fg-dim">
              {item.synopsis}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link to={`/watch/${item.id}`} className="btn-accent">
              ▶ Play
            </Link>
            <Link to={`/rooms?title=${item.id}`} className="btn-ghost">
              Start a room
            </Link>
            <button
              type="button"
              onClick={() => toggleWatchlist(item.id)}
              aria-pressed={saved}
              className="btn-ghost"
            >
              {saved ? '✓ On list' : '+ My list'}
            </button>
            <Link to={`/title/${item.id}`} className="btn-ghost">
              Details
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
