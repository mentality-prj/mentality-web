'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'

import { MoodRecordsList } from '@/components/features/MoodTracker/MoodRecords/MoodRecordsList/MoodRecordsList'
import { Pagination } from '@/components/shared/Pagination/Pagination'
import { PAGE_SIZE } from '@/constants/pagination'
import { useMoodRecordsFilters } from '@/context/moodRecordsFilterContext'
import { levelToMoodKey } from '@/mappers/mood.mappers'
import type { MoodRecordEntity } from '@/types/api-responses'
import { SORT_ORDER } from '@/types/sort'
import { STRESS_LEVELS } from '@/types/stress'
import { UserTag } from '@/types/tags'
import { Button } from '@/ui/button'

import { MoodRecordsFilter } from './MoodRecordsFilter'

type Props = {
  records: MoodRecordEntity[]
  availableTags: UserTag[]
}

export function MoodRecordsClient({ records, availableTags }: Props) {
  const mt = useTranslations('components.Mood')
  const ft = useTranslations('components.Filter')
  const { filters } = useMoodRecordsFilters()
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const filteredRecords = useMemo(() => {
    let result = [...records]

    // Filter by mood level
    if (filters.moodLevel) {
      result = result.filter((r) => {
        if (typeof r.moodLevel === 'number') {
          const key = levelToMoodKey(r.moodLevel)
          return key === filters.moodLevel
        }
        return false
      })
    }

    // Filter by stress level
    if (filters.stressLevel) {
      result = result.filter((r) => {
        if (typeof r.stressLevel === 'number') {
          // Map stress level number to stress key
          const stressKeys = STRESS_LEVELS
          const key = stressKeys[r.stressLevel]
          return key === filters.stressLevel
        }
        return false
      })
    }

    // Filter by tags
    if (filters.tags) {
      result = result.filter((r) => r.tags && r.tags.includes(filters.tags))
    }

    // Filter by week (weekDays/weekends)
    if (filters.week) {
      result = result.filter((r) => {
        if (!r.createdAt) return false
        const date = new Date(r.createdAt)
        const dayOfWeek = date.getDay()
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

        if (filters.week === 'weekends') return isWeekend
        if (filters.week === 'weekDays') return !isWeekend
        return true
      })
    }

    // Sort by date
    result.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return filters.order === SORT_ORDER.NEWEST ? timeB - timeA : timeA - timeB
    })

    return result
  }, [records, filters])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE))
  const startIndex = (page - 1) * PAGE_SIZE
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + PAGE_SIZE)

  // Reset to the first page when filters change so the user sees results
  // immediately after applying a filter. Also clamp the current `page`
  // if the number of total pages decreases below the current page.
  useEffect(() => {
    setPage(1)
  }, [filters])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [totalPages, page])

  return (
    <div id="mood-records-list" className="flex flex-col gap-sm">
      <div className="flex items-start justify-between">
        <h2>{mt('History.Title')}</h2>

        <Button
          type="button"
          aria-expanded={showFilters}
          aria-controls="mood-records-filters"
          onClick={() => setShowFilters((s) => !s)}
        >
          {showFilters ? ft('hideFilters') : ft('showFilters')}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-md">
        <div className={`flex flex-col gap-sm ${showFilters ? 'col-span-2' : 'col-span-3'}`}>
          {filteredRecords.length === 0 && <p className="mt-2 text-sm text-gray-500">{mt('History.Empty')}</p>}

          <MoodRecordsList records={paginatedRecords} />
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
        </div>
        <div id="mood-records-filters" className={`${showFilters ? 'block' : 'hidden'}`}>
          <MoodRecordsFilter availableTags={availableTags} />
        </div>
      </div>
    </div>
  )
}
