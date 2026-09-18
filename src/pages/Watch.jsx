import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTitle } from '../lib/catalog'
import { useStore } from '../lib/store'

const MEMBERS = [
  { name: 'You', tone: 'bg-accent' },
  { name: 'Nadia', tone: 'bg-base-600' },
  { name: 'Owen', tone: 'bg-base-600' },
  { name: 'Priya', tone: 'bg-base-600' },
]

const SEED = [
  { id: 1, user: 'Nadia', at: '00:04', body: 'opening shot was worth the wait' },
  { id: 2, user: 'Owen', at: '00:07', body: 'buffering for anyone else?' },
  { id: 3, user: 'Priya', at: '00:07', body: 'resynced you, try now' },
  { id: 4, user: 'Nadia', at: '00:12', body: 'no spoilers marek' },
]

function clock(seconds) {
  const s = Math.max(0, Math.floor(seconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (n) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`
}

export default function Watch() {
  const { id } = useParams()
  const { item, loading } = useTitle(id)
  const { progress, setProgress } = useStore()

  const total = (item?.runtime || 100) * 60
  const [playing, setPlaying] = useState(true)
  const [t, setT] = useState(0)
  const [messages, setMessages] = useState(SEED)
  const [draft, setDraft] = useState('')
  const chatEnd = useRef(null)
  const seeded = useRef(false)

  // Seed the playhead from stored progress once the title resolves.
  useEffect(() => {
    if (!item || seeded.current) return
    seeded.current = true
    const stored = progress[item.id]?.value
    if (stored) setT(Math.round(stored * total))
  }, [item, progress, total])

  useEffect(() => {
    if (!playing || !item) return undefined
    const timer = setInterval(() => setT((v) => Math.min(v + 1, total)), 1000)
    return () => clearInterval(timer)
  }, [playing, total, item])

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ block: 'nearest' })
  }, [messages])

  useEffect(() => {
    if (!item || !t) return undefined
    const timer = setTimeout(
      () => setProgress(item.id, t / total, `${Math.floor(t / 60)} min in`),
      600
    )
    return () => clearTimeout(timer)
  }, [t, total, item, setProgress])

  const pct = useMemo(() => (total ? (t / total) * 100 : 0), [t, total])

  if (loading) return <div className="shell py-10 text-xs text-fg-mute">Loading…</div>

  if (!item) {
    return (
      <div className="shell py-16 text-center">
        <p className="text-sm">That room has closed.</p>
        <Link to="/browse" className="btn-ghost mt-4">
          Find something to watch
        </Link>
      </div>
    )
  }

  const send = (e) => {
    e.preventDefault()
    const body = draft.trim()
    if (!body) return
    setMessages((m) => [...m, { id: Date.now(), user: 'You', at: clock(t), body, own: true }])
    setDraft('')
  }

  return (
    <div className="shell py-4">
      <div className="flex items-center gap-3 text-xs">
        <Link to={`/title/${item.id}`} className="text-fg-mute hover:text-fg">
          ‹ Details
        </Link>
        <span className="ml-auto flex items-center gap-1.5 text-fg-dim">
          <span className="h-1.5 w-1.5 bg-accent" />
          In sync
        </span>
        <span className="nums text-fg-mute">{MEMBERS.length} watching</span>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="relative border border-white/[0.07] bg-black">
            <div className="relative aspect-video">
              {item.backdrop ? (
                <img
                  src={item.backdrop}
                  alt=""
                  className="h-full w-full object-cover opacity-60"
                />
              ) : (
                <div className="h-full w-full bg-base-850" />
              )}

              {!playing && (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="absolute inset-0 grid place-items-center bg-base-900/40"
                  aria-label="Resume playback"
                >
                  <span className="grid h-12 w-12 place-items-center bg-accent text-white">▶</span>
                </button>
              )}
            </div>

            <div className="border-t border-white/[0.07] bg-base-850 px-2.5 py-2">
              <label className="sr-only" htmlFor="scrub">
                Playback position
              </label>
              <input
                id="scrub"
                type="range"
                min={0}
                max={total}
                value={t}
                onChange={(e) => setT(Number(e.target.value))}
                className="h-1 w-full cursor-pointer appearance-none"
                style={{
                  background: `linear-gradient(to right, #d83a45 ${pct}%, rgba(255,255,255,0.14) ${pct}%)`,
                }}
              />

              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPlaying((v) => !v)}
                  className="btn-icon"
                  aria-label={playing ? 'Pause' : 'Play'}
                >
                  {playing ? '❚❚' : '▶'}
                </button>
                <span className="nums text-2xs text-fg-dim">
                  {clock(t)} <span className="text-fg-mute">/ {clock(total)}</span>
                </span>
                <span className="truncate text-2xs text-fg-mute">{item.title}</span>
                <span className="ml-auto flex gap-1">
                  {MEMBERS.map((m) => (
                    <span
                      key={m.name}
                      title={m.name}
                      className={`h-5 w-5 text-center text-2xs leading-5 text-white ${m.tone}`}
                    >
                      {m.name[0]}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </div>

          <div className="card mt-3 grid grid-cols-3 divide-x divide-white/[0.06]">
            {[
              ['Playback', 'Host-controlled'],
              ['Drift', '42 ms'],
              ['Quality', '1080p auto'],
            ].map(([k, v]) => (
              <div key={k} className="px-3 py-2">
                <p className="label">{k}</p>
                <p className="mt-0.5 text-xs text-fg-dim">{v}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="card flex h-[460px] flex-col lg:h-auto">
          <div className="border-b border-white/[0.07] px-2.5 py-2">
            <p className="text-[13px] font-semibold">Chat</p>
          </div>

          <ul className="flex-1 space-y-2.5 overflow-y-auto px-2.5 py-2">
            {messages.map((m) => (
              <li key={m.id} className="text-xs">
                <span className="flex items-baseline gap-1.5">
                  <span className={m.own ? 'font-medium text-accent' : 'font-medium text-fg-dim'}>
                    {m.user}
                  </span>
                  <span className="nums text-2xs text-fg-mute">{m.at}</span>
                </span>
                <p className="mt-0.5 leading-relaxed text-fg-dim">{m.body}</p>
              </li>
            ))}
            <li ref={chatEnd} />
          </ul>

          <form onSubmit={send} className="flex gap-1.5 border-t border-white/[0.07] p-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Message…"
              aria-label="Chat message"
              className="min-w-0 flex-1 border border-white/10 bg-base-800 px-2 py-1.5 text-xs placeholder:text-fg-mute focus:border-white/25 focus:outline-none"
            />
            <button type="submit" disabled={!draft.trim()} className="btn-primary px-2.5 py-1.5">
              Send
            </button>
          </form>
        </aside>
      </div>
    </div>
  )
}
