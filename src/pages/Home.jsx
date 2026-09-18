import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import Rail from '../components/Rail'
import Artwork from '../lib/Artwork'
import { CATALOG, FEATURED, ROOMS, ROWS, getTitle } from '../data/catalog'
import { IconArrow, IconPlay, IconUsers } from '../lib/icons'
import { useStore } from '../lib/store'

function ContinueWatching() {
  const { progress } = useStore()
  const entries = Object.entries(progress)
    .map(([id, p]) => ({ item: getTitle(id), p }))
    .filter((e) => e.item && e.p.value > 0 && e.p.value < 1)

  if (!entries.length) return null

  return (
    <section className="shell py-7">
      <h2 className="font-display text-2xl font-semibold tracking-tight">Pick up where you left off</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {entries.map(({ item, p }) => (
          <Link
            key={item.id}
            to={`/watch/${item.id}`}
            className="group panel flex gap-4 overflow-hidden p-3 transition-colors duration-300 hover:border-teal-400/45"
          >
            <span className="relative h-24 w-[68px] shrink-0 overflow-hidden rounded-lg">
              <Artwork item={item} className="h-full w-full" />
              <span className="absolute inset-0 flex items-center justify-center bg-ink-950/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-400 text-ink-950">
                  <IconPlay size={14} />
                </span>
              </span>
            </span>
            <span className="flex min-w-0 flex-1 flex-col justify-center">
              <span className="truncate font-semibold text-mist-100">{item.title}</span>
              <span className="mt-0.5 truncate text-xs text-mist-500">{p.label}</span>
              <span className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                <span
                  className="block h-full rounded-full bg-teal-400"
                  style={{ width: `${Math.round(p.value * 100)}%` }}
                />
              </span>
              <span className="mt-1.5 text-[11px] text-mist-500">
                {Math.round(p.value * 100)}% watched
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function LiveRooms() {
  return (
    <section className="shell py-10">
      <div className="panel overflow-hidden">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.07] px-6 py-5">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 animate-pulse-soft rounded-full bg-teal-400" />
              Live now
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
              Rooms you can drop into
            </h2>
          </div>
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-300 hover:text-teal-400"
          >
            All rooms
            <IconArrow size={15} />
          </Link>
        </div>

        <ul className="divide-y divide-white/[0.05]">
          {ROOMS.map((room) => {
            const item = getTitle(room.titleId)
            return (
              <li key={room.id}>
                <Link
                  to={`/watch/${room.titleId}`}
                  className="flex items-center gap-4 px-6 py-4 transition-colors duration-200 hover:bg-white/[0.03]"
                >
                  <span className="h-14 w-10 shrink-0 overflow-hidden rounded-md border border-white/10">
                    <Artwork item={item} className="h-full w-full" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-mist-100">{item.title}</span>
                    <span className="block truncate text-xs text-mist-500">
                      Hosted by {room.host} · {room.note}
                    </span>
                  </span>
                  <span className="chip shrink-0">
                    <IconUsers size={13} />
                    {room.members}
                  </span>
                  <span className="hidden shrink-0 text-mist-500 sm:block">
                    <IconArrow size={16} />
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default function Home() {
  const rows = ROWS.map((row) => ({
    ...row,
    resolved: row.items.map(getTitle).filter(Boolean),
  }))

  return (
    <>
      <Hero items={FEATURED} />
      <ContinueWatching />
      {rows.slice(0, 2).map((row) => (
        <Rail key={row.id} title={row.title} caption={row.caption} items={row.resolved} />
      ))}
      <LiveRooms />
      {rows.slice(2, 4).map((row) => (
        <Rail key={row.id} title={row.title} caption={row.caption} items={row.resolved} />
      ))}
      <Rail
        title="Highest rated on Syncroom"
        caption={`Ranked across ${CATALOG.length} titles`}
        items={rows[4].resolved}
        ranked
      />
    </>
  )
}
