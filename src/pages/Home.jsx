import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import Rail from '../components/Rail'
import Poster from '../components/Poster'
import { useCatalog } from '../lib/catalog'
import { useStore } from '../lib/store'

function RailSkeleton() {
  return (
    <section className="mt-7">
      <div className="mb-2 h-3 w-40 bg-base-750" />
      <div className="track">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="w-[132px] shrink-0 sm:w-[146px]">
            <div className="aspect-[2/3] bg-base-800" />
            <div className="mt-1.5 h-3 w-4/5 bg-base-800" />
          </div>
        ))}
      </div>
    </section>
  )
}

function ContinueWatching({ lookup }) {
  const { progress } = useStore()
  const entries = Object.entries(progress)
    .map(([id, p]) => ({ item: lookup(id), p }))
    .filter((e) => e.item && e.p.value > 0 && e.p.value < 1)

  if (!entries.length) return null

  return (
    <section className="mt-7">
      <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-[0.1em]">Continue</h2>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {entries.map(({ item, p }) => (
          <Link
            key={item.id}
            to={`/watch/${item.id}`}
            className="card group flex gap-3 p-2 hover:border-white/20"
          >
            <span className="h-[72px] w-12 shrink-0 overflow-hidden border border-white/10">
              <Poster item={item} sizes="48px" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col justify-center">
              <span className="truncate text-[13px] text-fg-dim group-hover:text-fg">
                {item.title}
              </span>
              <span className="nums mt-0.5 text-2xs text-fg-mute">{p.label}</span>
              <span className="mt-2 block h-[3px] bg-white/10">
                <span
                  className="block h-full bg-accent"
                  style={{ width: `${Math.round(p.value * 100)}%` }}
                />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const { rows, featured, loading } = useCatalog()

  const lookup = (id) => {
    for (const row of rows) {
      const hit = row.items.find((i) => i.id === id)
      if (hit) return hit
    }
    return null
  }

  return (
    <>
      {featured[0] && <Hero item={featured[0]} />}

      <div className="shell pb-10">
        {loading ? (
          <>
            <RailSkeleton />
            <RailSkeleton />
          </>
        ) : (
          <>
            <ContinueWatching lookup={lookup} />
            {rows.map((row) => (
              <Rail key={row.id} title={row.title} items={row.items} ranked={row.ranked} />
            ))}
          </>
        )}
      </div>
    </>
  )
}
