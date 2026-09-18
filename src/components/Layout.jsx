import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import SearchOverlay from './SearchOverlay'
import { useStore } from '../lib/store'
import { useCatalog } from '../lib/catalog'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/browse', label: 'Browse' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/library', label: 'List' },
]

function ConfigNotice() {
  const { live, error } = useCatalog()
  const [hidden, setHidden] = useState(false)
  if (hidden || (live && !error)) return null

  return (
    <div className="border-b border-accent-dim/60 bg-accent-dim/20">
      <div className="shell flex items-center gap-3 py-1.5 text-2xs">
        <span className="text-fg-dim">
          {error
            ? `TMDB request failed: ${error}. Showing sample data.`
            : 'No TMDB credentials configured — showing sample data. Set VITE_TMDB_TOKEN or VITE_TMDB_API_KEY to load the real catalog.'}
        </span>
        <button
          type="button"
          onClick={() => setHidden(true)}
          className="ml-auto shrink-0 text-fg-mute hover:text-fg"
          aria-label="Dismiss notice"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default function Layout({ children }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const { watchlist } = useStore()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  useEffect(() => {
    const onKey = (e) => {
      const typing = ['INPUT', 'TEXTAREA'].includes(e.target?.tagName)
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:bg-fg focus:px-3 focus:py-1.5 focus:text-xs focus:font-medium focus:text-base-900"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-base-900/95 backdrop-blur">
        <div className="shell flex h-11 items-center gap-5">
          <Link to="/" className="flex items-center gap-2 text-[13px] font-semibold tracking-tight">
            <span className="h-3.5 w-3.5 border-2 border-accent" />
            syncroom
          </Link>

          <nav className="flex items-center gap-0.5" aria-label="Primary">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `whitespace-nowrap px-2 py-1 text-[13px] transition-colors duration-150 ${
                    isActive ? 'text-fg' : 'text-fg-mute hover:text-fg-dim'
                  }`
                }
              >
                {item.label}
                {item.to === '/library' && watchlist.length > 0 && (
                  <span className="nums ml-1 text-2xs text-fg-mute">{watchlist.length}</span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 border border-white/10 px-2 py-1 text-xs text-fg-mute hover:border-white/20 hover:text-fg-dim"
            >
              <span>⌕</span>
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden border border-white/10 px-1 text-2xs sm:inline">⌘K</kbd>
            </button>
            <span className="h-6 w-6 shrink-0 bg-base-700 text-center text-2xs leading-6 text-fg-dim">
              M
            </span>
          </div>
        </div>
      </header>

      <ConfigNotice />

      <main id="main">{children}</main>

      <footer className="mt-12 border-t border-white/[0.07] py-5">
        <div className="shell flex flex-wrap items-center gap-x-5 gap-y-2 text-2xs text-fg-mute">
          <span>syncroom — watch-along client</span>
          <span className="hidden sm:inline">⌘K to search</span>
          <span className="ml-auto">
            Catalog data &amp; artwork:{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noreferrer noopener"
              className="text-fg-dim underline decoration-white/20 hover:text-fg"
            >
              TMDB
            </a>
          </span>
        </div>
      </footer>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
