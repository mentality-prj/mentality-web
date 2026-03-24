'use client'

import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

import { usePathname, useRouter } from '../i18n/navigation'
import { MoodKey } from '../mappers/mood.mappers'
import { WeekValueType } from '../mappers/weekdays.mapper'
import { FilterType } from '../types/filter'
import { SortOrder } from '../types/sort'
import { StressLevel } from '../types/stress'

type UseMoodRecordsFilter = { order: SortOrder } & FilterType

export function useMoodRecordsFilter(initial: UseMoodRecordsFilter) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const filters = useMemo(() => {
    const result = { ...initial }

    function applyParser<K extends keyof UseMoodRecordsFilter>(k: K, param: string, result: UseMoodRecordsFilter) {
      const parser = parsers[`${k}`]
      if (parser) {
        result[`${k}`] = parser(param)
      }
    }

    const parsers: { [K in keyof UseMoodRecordsFilter]: (v: string) => UseMoodRecordsFilter[K] } = {
      order: (v) => v as SortOrder,
      moodLevel: (v) => v as MoodKey,
      stressLevel: (v) => v as StressLevel,
      energyLevel: (v) => v,
      focusLevel: (v) => v,
      tags: (v) => v.split(','),
      weekdays: (v) => v.split(',') as WeekValueType[],
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

      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [filters, pathname, router, searchParams]
  )

  const reset = useCallback(() => {
    const params = new URLSearchParams()

    ;(Object.keys(initial) as Array<keyof UseMoodRecordsFilter>).forEach((key) => {
      const value = initial[`${key}`]

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
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [initial, pathname, router])

  return { filters, setFilters, reset }
}
