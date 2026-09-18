import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Poster from '../components/Poster'
import TitleCard from '../components/TitleCard'
import { useCatalog, useTitle } from '../lib/catalog'
import { useStore } from '../lib/store'

/** Builds a flat id -> item map from every loaded row. */
function usePool() {
  const { rows } = useCatalog()
  return useMemo(() => {
    const map = new Map()
    rows.forEach((row) => row.items.forEach((i) => !map.has(i.id) && map.set(i.id, i)))
    return map
  }, [rows])
}

export function Library() {
  const { watchlist, progress } = useStore()
  const pool = usePool()

  const saved = watchlist.map((id) => pool.get(id)).filter(Boolean)
  const history = Object.entries(progress)
    .map(([id, p]) => ({ item: pool.get(id), p }))
    .filter((e) => e.item)

  return (
    <div className="shell py-6">
      <h1 className="text-[13px] font-semibold uppercase tracking-[0.1em]">My list</h1>
      <p className="mt-1 text-2xs text-fg-mute">Saved locally in this browser.</p>

      <section className="mt-5">
        <div className="mb-2 flex items-center gap-2">
          <h2 className="text-xs font-medium text-fg-dim">Saved</h2>
          <span className="nums text-2xs text-fg-mute">{saved.length}</span>
        </div>

        {saved.length === 0 ? (
          <div className="card flex flex-wrap items-center gap-3 p-4">
            <p className="text-xs text-fg-mute">
              Nothing saved yet. Use the <span className="text-fg-dim">+</span> on any poster.
            </p>
            <Link to="/browse" className="btn-ghost ml-auto">
              Browse
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(132px,1fr))] gap-2">
            {saved.map((item) => (
              <TitleCard key={item.id} item={item} width="w-full" />
            ))}
          </div>
        )}
      </section>

      {history.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-xs font-medium text-fg-dim">History</h2>
          <ul className="card divide-y-hair">
            {history.map(({ item, p }) => (
              <li key={item.id}>
                <Link to={`/watch/${item.id}`} className="flex items-center gap-3 p-2 hover:bg-white/[0.03]">
                  <span className="h-12 w-8 shrink-0 overflow-hidden border border-white/10">
                    <Poster item={item} sizes="32px" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] text-fg-dim">{item.title}</span>
                    <span className="mt-1.5 block h-[3px] max-w-[220px] bg-white/10">
                      <span
                        className="block h-full bg-accent"
                        style={{ width: `${Math.round(p.value * 100)}%` }}
                      />
                    </span>
                  </span>
                  <span className="nums shrink-0 text-2xs text-fg-mute">
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
  const presetId = params.get('title') || ''
  const { item: preset } = useTitle(presetId)
  const pool = usePool()

  // Fabricate a plausible "running now" list from whatever catalog is loaded.
  const live = useMemo(() => {
    const items = [...pool.values()].slice(0, 4)
    const hosts = ['Nadia', 'Owen', 'Priya', 'Marek']
    const notes = ['starting in 5 min', 'live · 23 min in', 'live · 8 min in', 'lobby open']
    return items.map((item, i) => ({
      item,
      host: hosts[i % hosts.length],
      note: notes[i % notes.length],
      members: [4, 7, 2, 11][i % 4],
    }))
  }, [pool])

  return (
    <div className="shell py-6">
      <h1 className="text-[13px] font-semibold uppercase tracking-[0.1em]">Rooms</h1>
      <p className="mt-1 max-w-lg text-2xs text-fg-mute">
        A room keeps every playhead aligned and puts chat beside the picture.
      </p>

      <section className="card mt-5 flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
        {presetId && preset && (
          <div className="w-[110px] shrink-0 border border-white/10">
            <div className="aspect-[2/3]">
              <Poster item={preset} sizes="110px" />
            </div>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h2 className="text-xs font-medium text-fg-dim">Host a room</h2>
          <p className="mt-1 text-2xs text-fg-mute">
            {preset ? (
              <>
                Starting with <span className="text-fg-dim">{preset.title}</span>
              </>
            ) : (
              'Pick a title, then share the join link.'
            )}
          </p>

          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
            {[
              ['Pause', 'Host only'],
              ['Size', 'Up to 12'],
              ['Chat', 'Timestamped'],
              ['Link', 'Expires 4h'],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="label">{k}</p>
                <p className="mt-0.5 text-xs text-fg-dim">{v}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to={preset ? `/watch/${preset.id}` : live[0] ? `/watch/${live[0].item.id}` : '/browse'}
              className="btn-accent"
            >
              ▶ Open room
            </Link>
            <Link to="/browse" className="btn-ghost">
              Choose title
            </Link>
          </div>
        </div>
      </section>

      {live.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-xs font-medium text-fg-dim">Running now</h2>
          <ul className="card divide-y-hair">
            {live.map((room) => (
              <li key={room.item.id}>
                <Link
                  to={`/watch/${room.item.id}`}
                  className="flex items-center gap-3 p-2 hover:bg-white/[0.03]"
                >
                  <span className="h-12 w-8 shrink-0 overflow-hidden border border-white/10">
                    <Poster item={room.item} sizes="32px" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] text-fg-dim">
                      {room.item.title}
                    </span>
                    <span className="block truncate text-2xs text-fg-mute">
                      {room.host} · {room.note}
                    </span>
                  </span>
                  <span className="nums shrink-0 text-2xs text-fg-mute">{room.members}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
