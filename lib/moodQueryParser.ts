import { filterOptions } from '@/constants/filter'
import { PAGE_SIZE } from '@/constants/pagination'
import { WeekValueType } from '@/mappers/weekdays.mapper'
import { SORT_ORDER } from '@/types/sort'
import { STRESS_LEVELS } from '@/types/stress'
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
  const getFirst = (value?: QueryValue): string | undefined => (Array.isArray(value) ? value[0] : value)

  // PAGE_SIZE is the number of records per page, not the maximum page number.
  const page = getSafePage(getFirst(params.page), Number.MAX_SAFE_INTEGER)
  const limit = PAGE_SIZE

  const normalizeArray = (value?: QueryValue): string[] => {
    if (!value) return []
    const values = Array.isArray(value) ? value : [value]
    const separated = values.flatMap((item) => item.split(','))
    const trimmed = separated.map((item) => item.trim())
    return trimmed.filter(Boolean)
  }

  const selectAllowed = <T extends string>(value: QueryValue, allowed: readonly T[]): T[] => {
    const candidates = normalizeArray(value)
    const selected = candidates.filter((item): item is T => allowed.includes(item as T))
    return Array.from(new Set(selected))
  }

  const allowedWeekdays: WeekValueType[] = ['weekDays', 'weekends', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  const validWeekdays = normalizeArray(params.weekdays).filter((day): day is WeekValueType => {
    return allowedWeekdays.includes(day as WeekValueType)
  })

  const filters: MapFiltersToApi = {
    order: getFirst(params.order) === SORT_ORDER.OLDEST ? SORT_ORDER.OLDEST : SORT_ORDER.NEWEST,
    tags: Array.from(new Set(normalizeArray(params.tags))),
    moodLevel: selectAllowed(params.moodLevel, filterOptions.moodLevel),
    stressLevel: selectAllowed(params.stressLevel, STRESS_LEVELS),
    energyLevel: selectAllowed(params.energyLevel, filterOptions.energyLevel),
    focusLevel: selectAllowed(params.focusLevel, filterOptions.focusLevel),
    weekdays: Array.from(new Set(validWeekdays)),
  }

  const mapped = mapFiltersToApi(filters)
  const single = (levels: number[]): number | undefined => (levels.length === 1 ? levels[0] : undefined)
  const multiple = (levels: number[]): number[] | undefined => (levels.length > 1 ? levels : undefined)

  return {
    page,
    limit,
    // Sorting is not yet supported by the backend's history endpoint.
    moodMin: single(mapped.moodLevel),
    moodMax: single(mapped.moodLevel),
    moodLevels: multiple(mapped.moodLevel),

    stressMin: single(mapped.stressLevel),
    stressMax: single(mapped.stressLevel),
    stressLevels: multiple(mapped.stressLevel),

    energyMin: single(mapped.energyLevel),
    energyMax: single(mapped.energyLevel),
    energyLevels: multiple(mapped.energyLevel),

    focusMin: single(mapped.focusLevel),
    focusMax: single(mapped.focusLevel),
    focusLevels: multiple(mapped.focusLevel),

    tags: filters.tags.length ? filters.tags : undefined,
    weekdays: mapped.weekdays?.length ? mapped.weekdays : undefined,
  }
}
