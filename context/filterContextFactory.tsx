'use client'
import { createContext, useContext, useState } from 'react'

export function createFilterContext<TFilters>() {
  const FilterContext = createContext<{
    filters: TFilters
    setFilters: React.Dispatch<React.SetStateAction<TFilters>>
    reset: () => void
  } | null>(null)

  const Provider = ({ initial, children }: { initial: TFilters; children: React.ReactNode }) => {
    const [filters, setFilters] = useState(initial)
    const reset = () => setFilters(initial)

    return <FilterContext.Provider value={{ filters, setFilters, reset }}>{children}</FilterContext.Provider>
  }

  const useFilters = () => {
    const ctx = useContext(FilterContext)
    if (!ctx) throw new Error('useFilters must be used inside Provider')
    return ctx
  }

  return { Provider, useFilters }
}
