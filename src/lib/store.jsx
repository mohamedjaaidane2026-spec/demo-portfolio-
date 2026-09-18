import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { CONTINUE_WATCHING } from '../data/catalog'

const KEY = 'syncroom:v1'
const StoreContext = createContext(null)

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '{}')
    return {
      watchlist: Array.isArray(parsed.watchlist) ? parsed.watchlist : [],
      progress: parsed.progress && typeof parsed.progress === 'object' ? parsed.progress : {},
    }
  } catch {
    return { watchlist: [], progress: {} }
  }
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return { watchlist: [], progress: {} }
    const stored = load()
    if (!Object.keys(stored.progress).length) {
      stored.progress = Object.fromEntries(
        CONTINUE_WATCHING.map((c) => [c.id, { value: c.progress, label: c.label }])
      )
    }
    return stored
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable — in-memory only */
    }
  }, [state])

  const toggleWatchlist = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      watchlist: prev.watchlist.includes(id)
        ? prev.watchlist.filter((x) => x !== id)
        : [id, ...prev.watchlist],
    }))
  }, [])

  const setProgress = useCallback((id, value, label) => {
    setState((prev) => ({
      ...prev,
      progress: { ...prev.progress, [id]: { value, label: label ?? prev.progress[id]?.label } },
    }))
  }, [])

  const value = useMemo(
    () => ({
      watchlist: state.watchlist,
      progress: state.progress,
      inWatchlist: (id) => state.watchlist.includes(id),
      toggleWatchlist,
      setProgress,
    }),
    [state, toggleWatchlist, setProgress]
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
