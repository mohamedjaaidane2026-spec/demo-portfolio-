import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as tmdb from './tmdb'
import { FALLBACK_ROWS, FALLBACK_FEATURED, findFallback, searchFallback } from '../data/catalog'

const CatalogContext = createContext(null)

export function CatalogProvider({ children }) {
  const live = tmdb.isConfigured()
  const [state, setState] = useState(() => ({
    rows: live ? [] : FALLBACK_ROWS,
    featured: live ? [] : FALLBACK_FEATURED,
    loading: live,
    error: null,
  }))

  useEffect(() => {
    if (!live) return undefined
    let cancelled = false

    tmdb
      .fetchHome()
      .then(({ rows, featured }) => {
        if (!cancelled) setState({ rows, featured, loading: false, error: null })
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            rows: FALLBACK_ROWS,
            featured: FALLBACK_FEATURED,
            loading: false,
            error: err.message,
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [live])

  const value = useMemo(() => ({ ...state, live }), [state, live])
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used inside CatalogProvider')
  return ctx
}

/** Loads a single title, plus related items. Works against TMDB or fixtures. */
export function useTitle(id) {
  const live = tmdb.isConfigured()
  const [state, setState] = useState(() => ({
    item: live ? null : findFallback(id),
    related: [],
    loading: live,
    error: null,
  }))

  useEffect(() => {
    if (!live) {
      setState({ item: findFallback(id), related: [], loading: false, error: null })
      return undefined
    }

    let cancelled = false
    setState((s) => ({ ...s, loading: true }))

    Promise.all([tmdb.fetchTitle(id), tmdb.fetchRelated(id)])
      .then(([item, related]) => {
        if (!cancelled) setState({ item, related, loading: false, error: null })
      })
      .catch((err) => {
        if (!cancelled) {
          setState({ item: findFallback(id), related: [], loading: false, error: err.message })
        }
      })

    return () => {
      cancelled = true
    }
  }, [id, live])

  return state
}

/** Debounced catalog search. */
export function useSearch(query) {
  const live = tmdb.isConfigured()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const q = query.trim()

    if (!live) {
      setResults(searchFallback(q))
      return undefined
    }
    if (!q) {
      setResults([])
      return undefined
    }

    setLoading(true)
    let cancelled = false
    const timer = setTimeout(() => {
      tmdb
        .searchTitles(q)
        .then((r) => !cancelled && setResults(r))
        .catch(() => !cancelled && setResults([]))
        .finally(() => !cancelled && setLoading(false))
    }, 220)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, live])

  return { results, loading }
}
