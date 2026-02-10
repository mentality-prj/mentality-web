import { ReactNode } from 'react'

import { SORT_ORDER } from '@/types/sort'

import { AffirmationsFilterProvider } from './affirmationsFilterContext'
import { SavedFilterProvider } from './savedFilterContext'

// TODO: add types so that it works when contexts have different types
const providers = [
  {
    Component: AffirmationsFilterProvider,
    props: {
      initial: { order: SORT_ORDER.NEWEST, tags: '' } as const,
    },
  },
  {
    Component: SavedFilterProvider,
    props: {
      initial: { order: SORT_ORDER.NEWEST, tags: '' } as const,
    },
  },
] as const

export const ContextProvider = ({ children }: { children: ReactNode }) =>
  providers.reduceRight((acc, { Component, props }) => {
    return <Component {...props}>{acc}</Component>
  }, children)
