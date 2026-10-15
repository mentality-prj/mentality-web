'use client'

import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

import { filterOptions } from '@/constants/filter'
import { usePathname, useRouter } from '@/i18n/navigation'
import { weekOptions, WeekValueType } from '@/mappers/weekdays.mapper'
import { FilterType } from '@/types/filter'
import { SORT_ORDER, SortOrder } from '@/types/sort'
import { STRESS_LEVELS } from '@/types/stress'
import { getBrowserTimeZone } from '@/utils/timeZone'

type UseMoodRecordsFilter = { order: SortOrder } & FilterType

export function useMoodRecordsFilter(initial: UseMoodRecordsFilter) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const filters = useMemo(() => {
    const result = { ...initial }

    const parseList = (value: string) => {
      const values = value.split(',')
      const trimmed = values.map((item) => item.trim())
      return Array.from(new Set(trimmed.filter(Boolean)))
    }

    const parseWeekdays = (value: string): WeekValueType[] => {
      const days = parseList(value)
      return days.filter((day): day is WeekValueType => weekOptions.includes(day as WeekValueType))
    }

    const parseLevelList = <T extends string>(value: string, allowed: readonly T[]): T[] => {
      const values = parseList(value)
      return values.filter((item): item is T => allowed.includes(item as T))
    }

    function applyParser<K extends keyof UseMoodRecordsFilter>(k: K, param: string, result: UseMoodRecordsFilter) {
      const parser = parsers[`${k}`]
      if (parser) {
        result[`${k}`] = parser(param)
      }
    }

    const parsers: { [K in keyof UseMoodRecordsFilter]: (v: string) => UseMoodRecordsFilter[K] } = {
      order: (v) => (v === SORT_ORDER.OLDEST ? SORT_ORDER.OLDEST : SORT_ORDER.NEWEST),
      moodLevel: (v) => parseLevelList(v, filterOptions.moodLevel),
      stressLevel: (v) => parseLevelList(v, STRESS_LEVELS),
      energyLevel: (v) => parseLevelList(v, filterOptions.energyLevel),
      focusLevel: (v) => parseLevelList(v, filterOptions.focusLevel),
      tags: parseList,
      weekdays: parseWeekdays,
    }

    ;(Object.keys(initial) as Array<keyof UseMoodRecordsFilter>).forEach((key) => {
      // Next searchParams can contain repeated list keys as well as CSV values.
      // get(key) would drop every occurrence after the first.
      const values = searchParams.getAll(key)
      if (values.length) {
        const param = key === 'order' ? values[0] : values.join(',')
        applyParser(key, param, result)
      }
    })
    return result
  }, [searchParams, initial])

  const setFilters = useCallback(
    (next: UseMoodRecordsFilter | ((prev: UseMoodRecordsFilter) => UseMoodRecordsFilter)) => {
      const current = filters
      const updates = typeof next === 'function' ? next(current) : next

      const params = new URLSearchParams(searchParams.toString())

      ;(Object.keys(updates) as Array<keyof UseMoodRecordsFilter>).forEach((key) => {
        const value = updates[`${key}`]

        if (Array.isArray(value)) {
          if (value.length) {
            params.set(key, value.join(','))
          } else {
            params.delete(key)
          }
        } else if (value != null) {
          params.set(key, String(value))
        } else {
          params.delete(key)
        }
      })

      // Bind weekday selection to the user's real browser time zone, not UTC.
      // Re-evaluate when other filters change so DST and travel are handled by MongoDB.
      if (updates.weekdays?.length) {
        params.set('timeZone', getBrowserTimeZone())
      } else {
        params.delete('timeZone')
      }

      params.set('page', '1')

      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [filters, pathname, router, searchParams]
  )

  const reset = useCallback(() => {
    // Clear only this component's filters and pagination. Preserve unrelated URL state.
    const params = new URLSearchParams(searchParams.toString())
    ;(Object.keys(initial) as Array<keyof UseMoodRecordsFilter>).forEach((key) => params.delete(key))
    params.delete('page')
    params.delete('timeZone')
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }, [initial, pathname, router, searchParams])

  return { filters, setFilters, reset }
}
