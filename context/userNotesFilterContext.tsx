'use client'

import { filterOptions } from '../constants/filter'
import { SortOrder } from '../types/sort'

import { createFilterContext } from './filterContextFactory'

type FilterValue<K extends keyof typeof filterOptions> = '' | (typeof filterOptions)[K][number]

export type UserNotesFilters = {
  order: SortOrder
  tags: string // User's custom tags
  week: FilterValue<'week'>
}

export const { Provider: UserNotesFilterProvider, useFilters: useUserNotesFilters } =
  createFilterContext<UserNotesFilters>()
