import { Link, useParams } from 'react-router-dom'
import Rail from '../components/Rail'
import { Meta } from '../components/TitleCard'
import Artwork from '../lib/Artwork'
import { CATALOG, getTitle } from '../data/catalog'
import { IconCheck, IconPlay, IconPlus, IconUsers } from '../lib/icons'
import { useStore } from '../lib/store'

function NotFound() {
  return (
    <div className="shell py-24 text-center">
      <h1 className="font-display text-3xl font-bold">We couldn’t find that title</h1>
      <p className="mt-3 text-mist-400">It may have left the catalog.</p>
      <Link to="/browse" className="btn-primary mt-7">
        Back to browse
      </Link>
    </div>
  )
}

export default function TitleDetail() {
  const { id } = useParams()
  const item = getTitle(id)
  const { inWatchlist, toggleWatchlist, progress } = useStore()

  if (!item) return <NotFound />

  const saved = inWatchlist(item.id)
  const p = progress[item.id]
  const related = CATALOG.filter(
    (t) => t.id !== item.id && t.genres.some((g) => item.genres.includes(g))
  ).slice(0, 8)

  const episodes =
    item.type === 'series'
      ? Array.from({ length: 6 }, (_, i) => ({
          n: i + 1,
          title: ['The Audit', 'Paper Trail', 'Six Weeks Prior', 'Quorum', 'The Long Room', 'Reconciliation'][i],
          runtime: item.runtime - 4 + ((i * 3) % 9),
        }))
      : []

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Artwork item={item} variant="wide" className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/80 to-ink-950/40" />
        </div>

        <div className="shell relative grid gap-10 pb-12 pt-16 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div className="hidden self-start overflow-hidden rounded-2xl border border-white/10 shadow-lift lg:block">
            <div className="aspect-[2/3]">
              <Artwork item={item} className="h-full w-full" />
            </div>
          </div>

          <div className="max-w-2xl animate-fade-up">
            <p className="eyebrow">
              {item.type === 'series' ? 'Series' : 'Film'} · {item.genres.join(' / ')}
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl">
              {item.title}
            </h1>
            <p className="mt-3 font-display text-lg italic text-teal-300/90">{item.tagline}</p>
            <Meta item={item} className="mt-5 text-sm" />

            <p className="mt-6 text-[15px] leading-relaxed text-mist-300">{item.synopsis}</p>

            {item.badges.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {item.badges.map((b) => (
                  <span key={b} className="chip text-teal-300">
                    {b}
                  </span>
                ))}
              </div>
            )}

            {p && p.value > 0 && p.value < 1 && (
              <div className="mt-7 max-w-md">
                <div className="h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-teal-400"
                    style={{ width: `${Math.round(p.value * 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-mist-500">
                  {p.label} · {Math.round(p.value * 100)}% watched
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to={`/watch/${item.id}`} className="btn-primary px-6 py-3">
                <IconPlay size={16} />
                {p && p.value > 0 ? 'Resume' : 'Play now'}
              </Link>
              <Link to={`/rooms?title=${item.id}`} className="btn-ghost px-6 py-3">
                <IconUsers size={16} />
                Start a room
              </Link>
              <button
                type="button"
                onClick={() => toggleWatchlist(item.id)}
                aria-pressed={saved}
                className={`btn border px-5 py-3 ${
                  saved
                    ? 'border-teal-400/60 bg-teal-400/15 text-teal-300'
                    : 'border-white/[0.12] bg-white/[0.04] text-mist-300 hover:border-white/30 hover:text-white'
                }`}
              >
                {saved ? <IconCheck size={16} /> : <IconPlus size={16} />}
                {saved ? 'On your list' : 'Add to list'}
              </button>
            </div>

            <dl className="mt-10 grid gap-x-10 gap-y-4 border-t border-white/[0.07] pt-7 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-mist-500">Directed by</dt>
                <dd className="mt-1 font-medium text-mist-100">{item.director}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-mist-500">Starring</dt>
                <dd className="mt-1 font-medium text-mist-100">{item.cast.join(', ')}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-mist-500">Member score</dt>
                <dd className="mt-1 font-medium text-amber-300">{item.rating.toFixed(1)} / 10</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-mist-500">
                  {item.type === 'series' ? 'Episode length' : 'Runtime'}
                </dt>
                <dd className="mt-1 font-medium text-mist-100">{item.runtime} min</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {episodes.length > 0 && (
        <section className="shell py-10">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Season {item.seasons} · Episodes
          </h2>
          <ul className="panel mt-5 divide-y divide-white/[0.05]">
            {episodes.map((ep) => (
              <li key={ep.n}>
                <Link
                  to={`/watch/${item.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-white/[0.03]"
                >
                  <span className="w-7 shrink-0 font-display text-xl font-bold text-mist-500">
                    {ep.n}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-mist-100">{ep.title}</span>
                    <span className="block text-xs text-mist-500">{ep.runtime} min</span>
                  </span>
                  <span className="shrink-0 text-teal-300">
                    <IconPlay size={16} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Rail title="Because you opened this" caption="Sharing a genre or two" items={related} />
    </>
  )
}
