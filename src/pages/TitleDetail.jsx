import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Poster from '../components/Poster'
import Rail from '../components/Rail'
import { Rating } from '../components/TitleCard'
import { useTitle } from '../lib/catalog'
import { fetchSeasonEpisodes, isConfigured } from '../lib/tmdb'
import { useStore } from '../lib/store'

function Episodes({ id, seasons }) {
  const [season, setSeason] = useState(seasons?.[0]?.number ?? 1)
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isConfigured() || !seasons?.length) return undefined
    let cancelled = false
    setLoading(true)
    fetchSeasonEpisodes(id, season)
      .then((eps) => !cancelled && setEpisodes(eps))
      .catch(() => !cancelled && setEpisodes([]))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [id, season, seasons])

  if (!seasons?.length) return null

  return (
    <section className="mt-8">
      <div className="mb-2 flex items-center gap-3">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em]">Episodes</h2>
        <select
          value={season}
          onChange={(e) => setSeason(Number(e.target.value))}
          className="border border-white/10 bg-base-850 px-1.5 py-1 text-xs"
        >
          {seasons.map((s) => (
            <option key={s.number} value={s.number}>
              {s.name || `Season ${s.number}`}
              {s.episodes ? ` (${s.episodes})` : ''}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-2xs text-fg-mute">Loading episodes…</p>
      ) : episodes.length === 0 ? (
        <p className="text-2xs text-fg-mute">No episode data.</p>
      ) : (
        <ul className="card divide-y-hair">
          {episodes.map((ep) => (
            <li key={ep.number} className="flex gap-3 p-2.5">
              <span className="nums w-6 shrink-0 text-xs text-fg-mute">{ep.number}</span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline gap-2">
                  <span className="text-[13px]">{ep.title}</span>
                  {ep.runtime && <span className="nums text-2xs text-fg-mute">{ep.runtime}m</span>}
                </span>
                {ep.synopsis && (
                  <span className="mt-0.5 line-clamp-2 block text-2xs leading-relaxed text-fg-mute">
                    {ep.synopsis}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default function TitleDetail() {
  const { id } = useParams()
  const { item, related, loading, error } = useTitle(id)
  const { inWatchlist, toggleWatchlist, progress } = useStore()

  if (loading) {
    return (
      <div className="shell py-6">
        <div className="flex gap-5">
          <div className="h-[300px] w-[200px] shrink-0 bg-base-800" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-1/2 bg-base-800" />
            <div className="h-3 w-1/3 bg-base-800" />
            <div className="h-16 w-full bg-base-800" />
          </div>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="shell py-16 text-center">
        <p className="text-sm">Title not found{error ? `: ${error}` : ''}.</p>
        <Link to="/browse" className="btn-ghost mt-4">
          Back to browse
        </Link>
      </div>
    )
  }

  const saved = inWatchlist(item.id)
  const p = progress[item.id]

  return (
    <>
      <div className="relative border-b border-white/[0.07]">
        {item.backdrop && (
          <div className="absolute inset-0">
            <img src={item.backdrop} alt="" className="h-full w-full object-cover object-top opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-t from-base-900 via-base-900/85 to-base-900/50" />
          </div>
        )}

        <div className="shell relative flex flex-col gap-5 py-6 sm:flex-row">
          <div className="w-[140px] shrink-0 self-start border border-white/10 sm:w-[200px]">
            <div className="aspect-[2/3]">
              <Poster item={item} src={item.posterLarge || item.poster} sizes="200px" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="label">
              {item.type === 'series' ? 'Series' : 'Film'}
              {item.genres?.length ? ` · ${item.genres.join(', ')}` : ''}
            </p>

            <h1 className="mt-1.5 text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
              {item.title}
            </h1>

            {item.tagline && (
              <p className="mt-1 text-[13px] text-fg-mute">{item.tagline}</p>
            )}

            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-dim">
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
              <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-fg-dim">
                {item.synopsis}
              </p>
            )}

            {p && p.value > 0 && p.value < 1 && (
              <div className="mt-3 max-w-xs">
                <div className="h-[3px] bg-white/10">
                  <div
                    className="h-full bg-accent"
                    style={{ width: `${Math.round(p.value * 100)}%` }}
                  />
                </div>
                <p className="nums mt-1 text-2xs text-fg-mute">
                  {p.label} · {Math.round(p.value * 100)}%
                </p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Link to={`/watch/${item.id}`} className="btn-accent">
                ▶ {p && p.value > 0 ? 'Resume' : 'Play'}
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
            </div>

            {Boolean(item.director || item.cast?.length) && (
              <dl className="mt-5 grid gap-x-8 gap-y-2 border-t border-white/[0.06] pt-4 text-xs sm:grid-cols-2">
                {item.director && (
                  <div>
                    <dt className="label">{item.type === 'series' ? 'Created by' : 'Director'}</dt>
                    <dd className="mt-0.5 text-fg-dim">{item.director}</dd>
                  </div>
                )}
                {item.cast?.length > 0 && (
                  <div>
                    <dt className="label">Cast</dt>
                    <dd className="mt-0.5 text-fg-dim">{item.cast.join(', ')}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        </div>
      </div>

      <div className="shell pb-10">
        {item.type === 'series' && <Episodes id={item.id} seasons={item.seasonList} />}
        <Rail title="Related" items={related} />
      </div>
    </>
  )
}
