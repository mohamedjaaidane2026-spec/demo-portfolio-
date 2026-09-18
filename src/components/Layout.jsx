import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import SearchOverlay from './SearchOverlay'
import { IconSearch, IconUsers } from '../lib/icons'
import { useStore } from '../lib/store'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/browse', label: 'Browse' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/library', label: 'My list' },
]

function Wordmark() {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="Syncroom home">
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-teal-400/15 ring-1 ring-inset ring-teal-400/40">
        <span className="h-2.5 w-2.5 rounded-full bg-teal-400 transition-transform duration-300 group-hover:bg-teal-300" />
        <span className="absolute h-5 w-5 rounded-full border border-teal-400/45" />
      </span>
      <span className="font-display text-[19px] font-bold tracking-tight">
        Sync<span className="text-teal-300">room</span>
      </span>
    </Link>
  )
}

export default function Layout({ children }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { watchlist } = useStore()
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-teal-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-950"
      >
        Skip to content
      </a>

      <header
        className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
          scrolled
            ? 'border-white/[0.07] bg-ink-950/85 backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        }`}
      >
        <div className="shell flex h-16 items-center gap-6">
          <Wordmark />

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `relative whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-mist-100' : 'text-mist-400 hover:text-mist-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {item.to === '/library' && watchlist.length > 0 && (
                      <span className="ml-1.5 rounded-full bg-teal-400/20 px-1.5 py-px text-[10px] font-bold text-teal-300">
                        {watchlist.length}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute inset-x-3.5 -bottom-[1px] h-[2px] rounded-full bg-teal-400" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="group hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-2 pl-3 pr-2.5 text-sm text-mist-400 transition-colors duration-200 hover:border-white/25 hover:text-mist-100 lg:flex"
            >
              <IconSearch size={16} />
              <span className="pr-8">Search</span>
              <kbd className="rounded border border-white/15 px-1.5 py-0.5 text-[10px] font-semibold text-mist-500">
                ⌘K
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="btn-quiet lg:hidden"
            >
              <IconSearch size={18} />
            </button>

            <Link to="/rooms" className="btn-primary hidden lg:inline-flex">
              <IconUsers size={16} />
              Start a room
            </Link>

            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-sm font-bold text-ink-950"
              title="Signed in as Mohamed"
            >
              M
            </span>
          </div>
        </div>
      </header>

      <nav
        className="sticky top-16 z-30 border-b border-white/[0.07] bg-ink-950/85 backdrop-blur-xl md:hidden"
        aria-label="Primary mobile"
      >
        <div className="shell flex gap-1 overflow-x-auto py-2">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'bg-teal-400/15 text-teal-300' : 'text-mist-400'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main id="main">{children}</main>

      <footer className="mt-20 border-t border-white/[0.07] py-12">
        <div className="shell flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Wordmark />
            <p className="mt-3 text-sm leading-relaxed text-mist-500">
              A watch-along client concept. Everything in this catalog — titles, synopses and cover
              art — is invented for the demo and generated in code.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm text-mist-400">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} className="hover:text-mist-100">
                {item.label}
              </Link>
            ))}
            <span className="text-mist-500">Press ⌘K to search</span>
            <span className="text-mist-500">Press / anywhere</span>
          </div>
        </div>
        <div className="shell mt-8 text-xs text-mist-500">
          Built with React, Vite and Tailwind CSS.
        </div>
      </footer>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
