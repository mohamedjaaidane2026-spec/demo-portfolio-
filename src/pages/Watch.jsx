import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Artwork from '../lib/Artwork'
import { CHAT_SEED, getTitle } from '../data/catalog'
import { IconArrow, IconPlay, IconSend, IconUsers } from '../lib/icons'
import { useStore } from '../lib/store'

const MEMBERS = [
  { name: 'Mohamed', role: 'you', hue: 'bg-teal-400' },
  { name: 'Nadia', role: 'host', hue: 'bg-amber-400' },
  { name: 'Owen', role: 'watching', hue: 'bg-indigo-400' },
  { name: 'Priya', role: 'watching', hue: 'bg-rose-400' },
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
  const item = getTitle(id)
  const { progress, setProgress } = useStore()
  const total = (item?.runtime ?? 100) * 60

  const [playing, setPlaying] = useState(true)
  const [t, setT] = useState(() => Math.round((progress[id]?.value ?? 0) * total))
  const [messages, setMessages] = useState(CHAT_SEED)
  const [draft, setDraft] = useState('')
  const chatEnd = useRef(null)

  useEffect(() => {
    if (!playing) return undefined
    const timer = setInterval(() => setT((v) => Math.min(v + 1, total)), 1000)
    return () => clearInterval(timer)
  }, [playing, total])

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ block: 'nearest' })
  }, [messages])

  useEffect(() => {
    if (!item) return
    const timer = setTimeout(() => setProgress(item.id, t / total, `${Math.floor(t / 60)} min in`), 500)
    return () => clearTimeout(timer)
  }, [t, total, item, setProgress])

  const pct = useMemo(() => (t / total) * 100, [t, total])

  if (!item) {
    return (
      <div className="shell py-24 text-center">
        <h1 className="font-display text-3xl font-bold">That room has closed</h1>
        <Link to="/browse" className="btn-primary mt-7">
          Find something to watch
        </Link>
      </div>
    )
  }

  const send = (e) => {
    e.preventDefault()
    const body = draft.trim()
    if (!body) return
    setMessages((m) => [...m, { id: Date.now(), user: 'Mohamed', at: clock(t), body, own: true }])
    setDraft('')
  }

  return (
    <div className="shell py-8">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to={`/title/${item.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-mist-400 hover:text-teal-300"
        >
          <span className="rotate-180">
            <IconArrow size={15} />
          </span>
          Back to details
        </Link>
        <span className="chip ml-auto text-teal-300">
          <span className="inline-block h-1.5 w-1.5 animate-pulse-soft rounded-full bg-teal-400" />
          In sync
        </span>
        <span className="chip">
          <IconUsers size={13} />
          {MEMBERS.length} watching
        </span>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-900 shadow-lift">
            <div className="relative aspect-video">
              <Artwork item={item} variant="wide" className="h-full w-full opacity-80" />
              <div className="absolute inset-0 bg-ink-950/35" />

              {!playing && (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center bg-ink-950/45"
                  aria-label="Resume playback"
                >
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal-400 text-ink-950 shadow-glow">
                    <IconPlay size={24} />
                  </span>
                </button>
              )}

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950 to-transparent p-5 pt-16">
                <p className="font-display text-xl font-semibold">{item.title}</p>
                <p className="text-xs text-mist-400">
                  {item.year} · {item.genres.join(' / ')} · hosted by Nadia
                </p>

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
                  className="mt-4 h-1.5 w-full cursor-pointer appearance-none rounded-full accent-teal-400"
                  style={{
                    background: `linear-gradient(to right, #38cfba ${pct}%, rgba(255,255,255,0.15) ${pct}%)`,
                  }}
                />

                <div className="mt-3 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setPlaying((v) => !v)}
                    className="btn-primary h-10 w-10 p-0"
                    aria-label={playing ? 'Pause' : 'Play'}
                  >
                    {playing ? (
                      <span className="flex gap-[3px]">
                        <span className="block h-3.5 w-[3px] rounded-sm bg-ink-950" />
                        <span className="block h-3.5 w-[3px] rounded-sm bg-ink-950" />
                      </span>
                    ) : (
                      <IconPlay size={16} />
                    )}
                  </button>
                  <span className="font-mono text-xs text-mist-300">
                    {clock(t)} <span className="text-mist-500">/ {clock(total)}</span>
                  </span>
                  <span className="ml-auto flex -space-x-2">
                    {MEMBERS.map((m) => (
                      <span
                        key={m.name}
                        title={`${m.name} · ${m.role}`}
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink-950 text-[11px] font-bold text-ink-950 ${m.hue}`}
                      >
                        {m.name[0]}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="panel mt-5 p-5">
            <p className="eyebrow">Room settings</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                { k: 'Playback', v: 'Host-controlled' },
                { k: 'Latency', v: '42 ms drift' },
                { k: 'Quality', v: '1080p · auto' },
              ].map((row) => (
                <div key={row.k} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-mist-500">{row.k}</p>
                  <p className="mt-1.5 font-semibold text-mist-100">{row.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="panel flex h-[600px] flex-col overflow-hidden lg:h-auto">
          <div className="border-b border-white/[0.07] px-5 py-4">
            <p className="font-display text-lg font-semibold">Room chat</p>
            <p className="text-xs text-mist-500">Timestamps follow the host’s playhead</p>
          </div>

          <ul className="flex-1 space-y-3.5 overflow-y-auto px-5 py-4">
            {messages.map((m) => (
              <li key={m.id} className="text-sm">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`font-semibold ${m.own ? 'text-teal-300' : 'text-mist-100'}`}
                  >
                    {m.user}
                  </span>
                  <span className="font-mono text-[10px] text-mist-500">{m.at}</span>
                </div>
                <p className="mt-0.5 leading-relaxed text-mist-300">{m.body}</p>
              </li>
            ))}
            <li ref={chatEnd} />
          </ul>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-white/[0.07] p-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Say something…"
              aria-label="Chat message"
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-mist-100 placeholder:text-mist-500 focus:border-teal-400/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="btn-primary h-10 w-10 shrink-0 p-0"
              aria-label="Send message"
            >
              <IconSend size={16} />
            </button>
          </form>
        </aside>
      </div>
    </div>
  )
}
