'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { MoodRecordsList } from '@/components/features/MoodTracker/MoodRecords/MoodRecordsList/MoodRecordsList'
import { Pagination } from '@/components/shared/Pagination/Pagination'
import type { MoodRecordEntity } from '@/types/api-responses'
import { UserTag } from '@/types/tags'
import { Button } from '@/ui/button'

import { MoodRecordsFilter } from './MoodRecordsFilter'

type Props = {
  records: MoodRecordEntity[]
  availableTags: UserTag[]
  totalCount: number
}

export function MoodRecordsClient({ records, availableTags, totalCount }: Props) {
  const mt = useTranslations('components.Mood')
  const ft = useTranslations('components.Filter')

  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const totalPages = Math.ceil(totalCount / 10)

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
          {records.length === 0 && <p className="mt-2 text-sm text-gray-500">{mt('History.Empty')}</p>}

          <MoodRecordsList records={records} />
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
        </div>
        <div id="mood-records-filters" className={`${showFilters ? 'block' : 'hidden'}`}>
          <MoodRecordsFilter availableTags={availableTags} />
        </div>
      </div>
    </div>
  )
}
