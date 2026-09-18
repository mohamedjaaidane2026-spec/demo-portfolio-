import { Link, useSearchParams } from 'react-router-dom'
import TitleCard from '../components/TitleCard'
import Artwork from '../lib/Artwork'
import { ROOMS, getTitle } from '../data/catalog'
import { IconArrow, IconPlay, IconUsers } from '../lib/icons'
import { useStore } from '../lib/store'

export function Library() {
  const { watchlist, progress } = useStore()
  const saved = watchlist.map(getTitle).filter(Boolean)
  const history = Object.entries(progress)
    .map(([id, p]) => ({ item: getTitle(id), p }))
    .filter((e) => e.item)

  return (
    <div className="shell py-12">
      <header className="max-w-2xl">
        <p className="eyebrow">Your account</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">My list</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-mist-400">
          Saved titles and watch history live in this browser. Nothing leaves your device.
        </p>
      </header>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Saved {saved.length > 0 && <span className="text-mist-500">({saved.length})</span>}
        </h2>
        {saved.length === 0 ? (
          <div className="panel mt-5 flex flex-col items-start gap-4 p-8">
            <p className="max-w-md text-sm leading-relaxed text-mist-400">
              Your list is empty. Tap the <span className="font-semibold text-mist-100">+</span> on
              any cover to save it for later.
            </p>
            <Link to="/browse" className="btn-primary">
              Browse the catalog
              <IconArrow size={15} />
            </Link>
          </div>
        ) : (
          <div className="mt-5 flex flex-wrap gap-5">
            {saved.map((item) => (
              <TitleCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {history.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Watch history</h2>
          <ul className="panel mt-5 divide-y divide-white/[0.05]">
            {history.map(({ item, p }) => (
              <li key={item.id}>
                <Link
                  to={`/watch/${item.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-white/[0.03]"
                >
                  <span className="h-14 w-10 shrink-0 overflow-hidden rounded-md border border-white/10">
                    <Artwork item={item} className="h-full w-full" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-mist-100">{item.title}</span>
                    <span className="mt-2 block h-1 max-w-xs overflow-hidden rounded-full bg-white/10">
                      <span
                        className="block h-full rounded-full bg-teal-400"
                        style={{ width: `${Math.round(p.value * 100)}%` }}
                      />
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-mist-500">
                    {Math.round(p.value * 100)}%
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export function Rooms() {
  const [params] = useSearchParams()
  const preset = getTitle(params.get('title') || '')

  return (
    <div className="shell py-12">
      <header className="max-w-2xl">
        <p className="eyebrow">Watch together</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">Rooms</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-mist-400">
          A room keeps everyone’s playhead aligned and puts chat beside the picture. Host one, or
          drop into whatever is already running.
        </p>
      </header>

      <section className="panel mt-10 grid items-start gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">Host a room</h2>
          <p className="mt-2 text-sm text-mist-400">
            {preset ? (
              <>
                Starting with <span className="font-semibold text-mist-100">{preset.title}</span>.
              </>
            ) : (
              'Pick a title, set who can control playback, and share the link.'
            )}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { k: 'Who can pause', v: 'Host only' },
              { k: 'Room size', v: 'Up to 12' },
              { k: 'Chat', v: 'On, timestamped' },
              { k: 'Join link', v: 'Expires in 4 h' },
            ].map((row) => (
              <div key={row.k} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-mist-500">{row.k}</p>
                <p className="mt-1.5 font-semibold text-mist-100">{row.v}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to={preset ? `/watch/${preset.id}` : '/watch/the-quiet-orbit'}
              className="btn-primary px-6 py-3"
            >
              <IconPlay size={16} />
              Open the room
            </Link>
            <Link to="/browse" className="btn-ghost px-6 py-3">
              Choose a different title
            </Link>
          </div>
        </div>

        {preset && (
          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-lift">
            <div className="aspect-[2/3]">
              <Artwork item={preset} className="h-full w-full" />
            </div>
          </div>
        )}
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Running now</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {ROOMS.map((room) => {
            const item = getTitle(room.titleId)
            return (
              <Link
                key={room.id}
                to={`/watch/${room.titleId}`}
                className="group panel flex gap-4 p-4 transition-colors duration-300 hover:border-teal-400/45"
              >
                <span className="h-24 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10">
                  <Artwork item={item} className="h-full w-full" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col justify-center">
                  <span className="truncate font-display text-lg font-semibold text-mist-100">
                    {item.title}
                  </span>
                  <span className="mt-0.5 truncate text-xs text-mist-500">
                    Hosted by {room.host}
                  </span>
                  <span className="mt-2 flex items-center gap-3 text-xs text-mist-400">
                    <span className="chip">
                      <IconUsers size={12} />
                      {room.members}
                    </span>
                    <span className="truncate text-teal-300">{room.note}</span>
                  </span>
                </span>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
