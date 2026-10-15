'use client'

import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

import { filterOptions } from '@/constants/filter'
import { usePathname, useRouter } from '@/i18n/navigation'
import { EnergyKey } from '@/mappers/energy.mappers'
import { FocusKey } from '@/mappers/focus.mappers'
import { MoodKey } from '@/mappers/mood.mappers'
import { weekOptions, WeekValueType } from '@/mappers/weekdays.mapper'
import { FilterType } from '@/types/filter'
import { SORT_ORDER, SortOrder } from '@/types/sort'
import { STRESS_LEVELS, StressLevel } from '@/types/stress'

type UseMoodRecordsFilter = { order: SortOrder } & FilterType

export function useMoodRecordsFilter(initial: UseMoodRecordsFilter) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const filters = useMemo(() => {
    const result = { ...initial }

    const parseChoice = <T extends string>(value: string, allowed: readonly T[]): T | '' =>
      allowed.find((option) => option === value) ?? ''

    const parseList = (value: string) => {
      const items = value.split(',').map((item) => item.trim()).filter(Boolean)
      return Array.from(new Set(items))
    }

    const parseWeekdays = (value: string): WeekValueType[] =>
      parseList(value).filter((day): day is WeekValueType => weekOptions.includes(day as WeekValueType))

    function applyParser<K extends keyof UseMoodRecordsFilter>(k: K, param: string, result: UseMoodRecordsFilter) {
      const parser = parsers[`${k}`]
      if (parser) {
        result[`${k}`] = parser(param)
      }
    }

    const parsers: { [K in keyof UseMoodRecordsFilter]: (v: string) => UseMoodRecordsFilter[K] } = {
      order: (v) => (v === SORT_ORDER.OLDEST ? SORT_ORDER.OLDEST : SORT_ORDER.NEWEST),
      moodLevel: (v) => parseChoice(v, filterOptions.moodLevel) as MoodKey | '',
      stressLevel: (v) => parseChoice(v, STRESS_LEVELS) as StressLevel | '',
      energyLevel: (v) => parseChoice(v, filterOptions.energyLevel) as EnergyKey | '',
      focusLevel: (v) => parseChoice(v, filterOptions.focusLevel) as FocusKey | '',
      tags: parseList,
      weekdays: parseWeekdays,
    }

    ;(Object.keys(initial) as Array<keyof UseMoodRecordsFilter>).forEach((key) => {
      const param = searchParams.get(key)

      if (param !== null) {
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
        } else if (value != null && value !== '') {
          params.set(key, String(value))
        } else {
          params.delete(key)
        }
      })

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
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }, [initial, pathname, router, searchParams])

  return { filters, setFilters, reset }
}
