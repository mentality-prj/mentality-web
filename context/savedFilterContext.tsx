'use client'
import { filterOptions } from '@/constants/filter'
import { SortOrder } from '@/types/sort'

import { createFilterContext } from './filterContextFactory'

type FilterValue<K extends keyof typeof filterOptions> = '' | (typeof filterOptions)[K][number]

export type SavedFilters = {
  order: SortOrder
  categories: FilterValue<'categories'>
}

export const { Provider: SavedFilterProvider, useFilters: useSavedFilters } = createFilterContext<SavedFilters>()
