'use client'

import { WeekValueType } from '../mappers/weekdays.mapper'
import { SortOrder } from '../types/sort'

import { createFilterContext } from './filterContextFactory'

export type UserNotesFilters = {
  order: SortOrder
  tags: string[] // User's custom tags
  weekdays: WeekValueType[]
}

export const { Provider: UserNotesFilterProvider, useFilters: useUserNotesFilters } =
  createFilterContext<UserNotesFilters>()
