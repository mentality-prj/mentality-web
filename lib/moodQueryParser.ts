import { PAGE_SIZE } from '@/constants/pagination'
import { FilterValue } from '@/context/moodRecordsFilterContext'
import { WeekValueType } from '@/mappers/weekdays.mapper'
import { SortOrder } from '@/types/sort'
import { getSafePage } from '@/utils/getSafePage'

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

  const page = getSafePage(getFirst(params.page), PAGE_SIZE)
  const limit = PAGE_SIZE

  const normalizeArray = (value?: string[] | string): string[] =>
    value ? (Array.isArray(value) ? value : value.split(',')).map((v) => v.trim()).filter(Boolean) : []

  const allowedWeekdays: WeekValueType[] = ['weekDays', 'weekends', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

  const filters: MapFiltersToApi = {
    order: (getFirst(params.order) as SortOrder) ?? 'newest',
    tags: Array.from(new Set(normalizeArray(params.tags))),
    moodLevel: getFirst(params.moodLevel) as FilterValue<'moodLevel'>,
    stressLevel: getFirst(params.stressLevel) as FilterValue<'stressLevel'>,
    weekdays: normalizeArray(params.weekdays).filter((d): d is WeekValueType =>
      allowedWeekdays.includes(d as WeekValueType)
    ),
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
    weekdays: mapped.weekdays?.length ? mapped.weekdays : undefined,
  }
}
