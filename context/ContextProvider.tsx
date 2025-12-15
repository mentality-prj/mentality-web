import { ReactNode } from 'react'

import { AffirmationsFilterProvider } from './affirmationsFilterContext'
import { SavedFilterProvider } from './savedFilterContext'

// TODO: add types so that it works when contexts have different types
const providers = [
  {
    Component: AffirmationsFilterProvider,
    props: {
      initial: { order: 'newest', tags: '' } as const,
    },
  },
  {
    Component: SavedFilterProvider,
    props: {
      initial: { order: 'newest', tags: '' } as const,
    },
  },
] as const

export const ContextProvider = ({ children }: { children: ReactNode }) =>
  providers.reduceRight((acc, { Component, props }) => {
    return <Component {...props}>{acc}</Component>
  }, children)
