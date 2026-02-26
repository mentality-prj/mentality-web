'use client'
import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'

import { Pagination } from '@/components/shared/Pagination/Pagination'
import { PAGE_SIZE } from '@/constants/pagination'
import { useUserNotesFilters } from '@/context/userNotesFilterContext'
import { DiaryEntity } from '@/types/api-responses'
import { SORT_ORDER } from '@/types/sort'
import { UserTag } from '@/types/tags'
import { Button } from '@/ui/button'

import { UserNotesList } from './UserNotesList/UserNotesList'
import { UserNotesFilter } from './UserNotesFilter'

type Props = {
  notes: DiaryEntity[]
  availableTags: UserTag[]
}

export function UserNotesClient({ notes, availableTags }: Props) {
  const ft = useTranslations('components.Filter')
  const nt = useTranslations('components.Diary')
  const { filters } = useUserNotesFilters()
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const filteredNotes = useMemo(() => {
    let result = [...notes]
    // Filter by tags
    if (filters.tags) {
      result = result.filter((n) => n.tags && n.tags.includes(filters.tags))
    }

    // Filter by week (weekDays/weekends)
    if (filters.week) {
      result = result.filter((n) => {
        if (!n.createdAt) return false
        const date = new Date(n.createdAt)
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
  }, [notes, filters])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredNotes.length / PAGE_SIZE))
  const startIndex = (page - 1) * PAGE_SIZE
  const paginatedNotes = filteredNotes.slice(startIndex, startIndex + PAGE_SIZE)

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
    <div className="flex flex-col gap-sm">
      <div className="flex items-start justify-between">
        <h2>{nt('HistoryTitle')}</h2>

        <Button
          type="button"
          aria-expanded={showFilters}
          aria-controls="user-notes-filters"
          onClick={() => setShowFilters((s) => !s)}
        >
          {showFilters ? ft('hideFilters') : ft('showFilters')}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-md">
        <div className={`flex flex-col gap-sm ${showFilters ? 'col-span-2' : 'col-span-3'}`}>
          {filteredNotes.length === 0 && <p className="mt-2 text-sm text-gray-500">У вас ще немає записів</p>}

          <UserNotesList notes={paginatedNotes} availableTags={availableTags} />
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
        </div>
        <div id="user-notes-filters" className={`${showFilters ? 'block' : 'hidden'}`}>
          <UserNotesFilter availableTags={availableTags} />
        </div>
      </div>
    </div>
  )
}
