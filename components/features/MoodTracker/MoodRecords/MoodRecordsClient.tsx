'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { MoodRecordsList } from '@/components/features/MoodTracker/MoodRecords/MoodRecordsList/MoodRecordsList'
import { Pagination } from '@/components/shared/Pagination/Pagination'
import { PAGE_SIZE } from '@/constants/pagination'
import { usePathname, useRouter } from '@/i18n/navigation'
import type { MoodRecordEntity } from '@/types/api-responses'
import { UserTag } from '@/types/tags'
import { Button } from '@/ui/button'
import { getSafePage } from '@/utils/getSafePage'

import { MoodRecordsFilter } from './MoodRecordsFilter'

type Props = {
  records: MoodRecordEntity[]
  availableTags: UserTag[]
  totalCount: number
}

export function MoodRecordsClient({ records, availableTags, totalCount }: Props) {
  const mt = useTranslations('components.Mood')
  const ft = useTranslations('components.Filter')

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const [showFilters, setShowFilters] = useState(false)

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const page = getSafePage(searchParams.get('page'), totalPages)

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

      <div className="flex flex-col-reverse gap-md tablet:flex-row">
        <div className={`flex flex-col gap-sm ${showFilters ? 'md:w-3/5 xl:w-2/3' : 'w-full'}`}>
          {records.length === 0 && <p className="mt-2 text-sm text-gray-500">{mt('History.Empty')}</p>}

          <MoodRecordsList records={records} />
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />}
        </div>
        <div id="mood-records-filters" className={`${showFilters ? 'md:w-2/5 xl:w-1/3' : 'hidden'}`}>
          <MoodRecordsFilter availableTags={availableTags} />
        </div>
      </div>
    </div>
  )
}
