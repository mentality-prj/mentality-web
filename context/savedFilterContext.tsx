'use client'
import { filterOptions } from '@/constants/filter'

import { createFilterContext } from './filterContextFactory'

type FilterValue<K extends keyof typeof filterOptions> = '' | (typeof filterOptions)[K][number]

export type SavedFilters = {
  order: 'newest' | 'oldest'
  tags: FilterValue<'tags'>
}

export const { Provider: SavedFilterProvider, useFilters: useSavedFilters } = createFilterContext<SavedFilters>()
