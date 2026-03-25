import { FilterValue } from '../context/moodRecordsFilterContext'
import { WeekValueType } from '../mappers/weekdays.mapper'
import { SortOrder } from '../types/sort'

import { MapFiltersToApi, mapFiltersToApi } from './mapFiltersToApi'

type QueryValue = string | string[] | undefined

type MoodQueryParams = {
  page?: QueryValue
  limit?: QueryValue
  order?: QueryValue
  moodLevel?: QueryValue
  stressLevel?: QueryValue
  energyLevel?: QueryValue
  focusLevel?: QueryValue
  tags?: QueryValue
  weekdays?: QueryValue
}

export function parseMoodQuery(params: MoodQueryParams) {
  const getFirst = (value?: string | string[]): string | undefined => {
    if (!value) return undefined
    return Array.isArray(value) ? value[0] : value
  }

  const page = Number(getFirst(params.page)) || 1
  const limit = Number(getFirst(params.limit)) || 10

  const normalizeArray = (value?: string[] | string): string[] | undefined => {
    if (!value) return undefined
    if (Array.isArray(value)) return value
    return value.split(',')
  }

  const filters: MapFiltersToApi = {
    order: (getFirst(params.order) as SortOrder) ?? 'newest',
    tags: normalizeArray(params.tags) ?? [],
    moodLevel: getFirst(params.moodLevel) as FilterValue<'moodLevel'>,
    stressLevel: getFirst(params.stressLevel) as FilterValue<'stressLevel'>,
    weekdays: (normalizeArray(params.weekdays) as WeekValueType[]) ?? [],
  }

  const mapped = mapFiltersToApi(filters)

  return {
    page,
    limit,
    // TODO: order parameter
    moodMin: mapped.moodLevel,
    moodMax: mapped.moodLevel,

    stressMin: mapped.stressLevel,
    stressMax: mapped.stressLevel,

    tags: filters.tags.length ? filters.tags : undefined,
    weekdays: mapped.weekdays,
  }
}
