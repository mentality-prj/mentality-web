'use client'
import { filterOptions } from '@/constants/filter'
import { SortOrder } from '@/types/sort'

import { WeekValueType } from '../mappers/weekdays.mapper'

import { createFilterContext } from './filterContextFactory'

export type FilterValue<K extends keyof typeof filterOptions> = '' | (typeof filterOptions)[K][number]

export type MoodRecordsFilters = {
  order: SortOrder
  tags: string[] // User's custom tags
  moodLevel: FilterValue<'moodLevel'>
  stressLevel: FilterValue<'stressLevel'>
  week: WeekValueType[]
}

export const { Provider: MoodRecordsFilterProvider, useFilters: useMoodRecordsFilters } =
  createFilterContext<MoodRecordsFilters>()
