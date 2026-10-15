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
  const getFirst = (value?: QueryValue): string | undefined =>
    Array.isArray(value) ? value[0] : value

  // PAGE_SIZE is the number of records per page, not the maximum page number.
  const page = getSafePage(getFirst(params.page), Number.MAX_SAFE_INTEGER)
  const limit = PAGE_SIZE

  const normalizeArray = (value?: QueryValue): string[] =>
    value
      ? (Array.isArray(value) ? value : [value])
          .flatMap((item) => item.split(','))
          .map((item) => item.trim())
          .filter(Boolean)
      : []

  const selectAllowed = <T extends string>(value: QueryValue, allowed: readonly T[]): T | '' => {
    const candidate = getFirst(value)?.trim()
    return allowed.find((item) => item === candidate) ?? ''
  }

  const allowedWeekdays: WeekValueType[] = ['weekDays', 'weekends', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

  const filters: MapFiltersToApi = {
    order: selectAllowed(params.order, [SORT_ORDER.NEWEST, SORT_ORDER.OLDEST]) || SORT_ORDER.NEWEST,
    tags: Array.from(new Set(normalizeArray(params.tags))),
    moodLevel: selectAllowed(params.moodLevel, filterOptions.moodLevel),
    stressLevel: selectAllowed(params.stressLevel, STRESS_LEVELS),
    energyLevel: selectAllowed(params.energyLevel, filterOptions.energyLevel),
    focusLevel: selectAllowed(params.focusLevel, filterOptions.focusLevel),
    weekdays: Array.from(
      new Set(normalizeArray(params.weekdays).filter((d): d is WeekValueType => allowedWeekdays.includes(d as WeekValueType)))
    ),
  }

  const mapped = mapFiltersToApi(filters)

  return {
    page,
    limit,
    // Sorting is not yet supported by the backend's history endpoint.
    moodMin: mapped.moodLevel,
    moodMax: mapped.moodLevel,

    stressMin: mapped.stressLevel,
    stressMax: mapped.stressLevel,

    energyMin: mapped.energyLevel,
    energyMax: mapped.energyLevel,

    focusMin: mapped.focusLevel,
    focusMax: mapped.focusLevel,

    tags: filters.tags.length ? filters.tags : undefined,
    weekdays: mapped.weekdays?.length ? mapped.weekdays : undefined,
  }
}
