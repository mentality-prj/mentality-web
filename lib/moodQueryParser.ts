import { FilterValue } from '../context/moodRecordsFilterContext'
import { WeekValueType } from '../mappers/weekdays.mapper'
import { SortOrder } from '../types/sort'

import { MapFiltersToApi, mapFiltersToApi } from './mapFiltersToApi'

type MoodQueryParams = {
  page?: string
  limit?: string
  order?: string
  moodLevel?: string
  stressLevel?: string
  energyLevel?: string
  focusLevel?: string

  tags?: string[] | string
  week?: string[] | string
}

export function parseMoodQuery(params: MoodQueryParams) {
  const page = Number(params.page) || 1
  const limit = Number(params.limit) || 10

  const normalizeArray = (value?: string[] | string): string[] | undefined => {
    if (!value) return undefined
    if (Array.isArray(value)) return value
    return value.split(',')
  }

  // тоді

  const filters: MapFiltersToApi = {
    order: (params.order as SortOrder) ?? 'newest',
    tags: normalizeArray(params.tags) ?? [], // <- тепер завжди string[]
    moodLevel: params.moodLevel as FilterValue<'moodLevel'>,
    stressLevel: params.stressLevel as FilterValue<'stressLevel'>,
    weekdays: (normalizeArray(params.week) as WeekValueType[]) ?? [], // <- тепер завжди string[]
  }

  const mapped = mapFiltersToApi(filters)

  return {
    page,
    limit,

    moodMin: mapped.moodLevel,
    moodMax: mapped.moodLevel,

    stressMin: mapped.stressLevel,
    stressMax: mapped.stressLevel,

    tags: filters.tags.length ? filters.tags : undefined,
    weekdays: mapped.weekdays,
  }
}
