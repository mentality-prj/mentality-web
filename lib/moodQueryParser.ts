import { filterOptions } from '@/constants/filter'
import { PAGE_SIZE } from '@/constants/pagination'
import { FilterValue } from '@/context/moodRecordsFilterContext'
import { WeekValueType } from '@/mappers/weekdays.mapper'

import { MapFiltersToApi, mapFiltersToApi } from './mapFiltersToApi'

// Keep consistent with GetMoodRecordsQueryDto.page's bounded server contract.
const MAX_MOOD_PAGE = 10_000

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

function parseAllowedFilter<K extends 'moodLevel' | 'stressLevel' | 'energyLevel' | 'focusLevel'>(
  key: K,
  value?: string
): FilterValue<K> {
  const options = filterOptions[key] as readonly string[]
  return value && options.includes(value) ? (value as FilterValue<K>) : ''
}

export function parseMoodQuery(params: MoodQueryParams) {
  const getFirst = (value?: string | string[]): string | undefined => {
    if (!value) return undefined
    return Array.isArray(value) ? value[0] : value
  }

  const rawPage = Number(getFirst(params.page))
  const page = Number.isSafeInteger(rawPage) && rawPage >= 1 ? Math.min(rawPage, MAX_MOOD_PAGE) : 1
  const limit = PAGE_SIZE

  const normalizeArray = (value?: string[] | string): string[] =>
    value
      ? (Array.isArray(value) ? value : [value])
          .flatMap((v) => v.split(','))
          .map((v) => v.trim())
          .filter(Boolean)
      : []

  const allowedWeekdays: WeekValueType[] = ['weekDays', 'weekends', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

  const filters: MapFiltersToApi = {
    order: getFirst(params.order) === 'oldest' ? 'oldest' : 'newest',
    tags: Array.from(new Set(normalizeArray(params.tags))),
    moodLevel: parseAllowedFilter('moodLevel', getFirst(params.moodLevel)),
    stressLevel: parseAllowedFilter('stressLevel', getFirst(params.stressLevel)),
    energyLevel: parseAllowedFilter('energyLevel', getFirst(params.energyLevel)),
    focusLevel: parseAllowedFilter('focusLevel', getFirst(params.focusLevel)),
    weekdays: normalizeArray(params.weekdays).filter((d): d is WeekValueType =>
      allowedWeekdays.includes(d as WeekValueType)
    ),
  }

  const mapped = mapFiltersToApi(filters)

  return {
    page,
    limit,
    order: filters.order,
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
