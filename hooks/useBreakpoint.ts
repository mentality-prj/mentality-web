'use client'

import { useEffect, useState } from 'react'

export const BREAKPOINTS = {
  tablet: 480,
  sm: 640,
  laptop: 768,
  wide: 860,
  desktop: 1024,
} as const

export type Breakpoint = keyof typeof BREAKPOINTS

export function useBreakpoint(breakpoint: Breakpoint) {
  const query = `(min-width: ${BREAKPOINTS[breakpoint]}px)`

  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    setMatches(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}
