'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { Filter } from '@/components/shared/Filter/Filter'
import { Pagination } from '@/components/shared/Pagination/Pagination'
import { PAGE_SIZE } from '@/constants/pagination'
import { useSavedFilters } from '@/context/savedFilterContext'
import { extractPaginationTotal } from '@/lib/http'
import { logger } from '@/lib/logger'
import { getFavorites } from '@/requests/favorites'
import { FavoriteEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'
import { Button } from '@/ui/button'

import { FilteredList } from './FilteredList'

export const SavedList = () => {
  const t = useTranslations('common.title')
  const ft = useTranslations('components.Filter')
  const [showFilters, setShowFilters] = useState(false)
  const [items, setItems] = useState<FavoriteEntity[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const totalPages = Math.max(1, Math.ceil(total / limit))

  const { data: session } = useSession()

  useEffect(() => {
    let mounted = true

    async function loadFavorites() {
      try {
        const res = await getFavorites(session as CustomSession | null, page, limit, true)

        if (res.error || !res.data) {
          if (mounted) setItems([])
          return
        }

        const list = res.data
        const totalCount = extractPaginationTotal(res.headers, list.length)
        if (mounted) setTotal(totalCount)

        if (mounted) setItems(list || [])
      } catch (err) {
        logger.error('Failed to load favorites', { error: err instanceof Error ? err.message : String(err) })
        if (mounted) setItems([])
      }
    }

    loadFavorites()

    return () => {
      mounted = false
    }
  }, [session, page, limit])

  return (
    <div id="saved-list" className="flex flex-col gap-sm">
      <div className="ml-auto mt-4 flex">
        <Button
          type="button"
          aria-expanded={showFilters}
          aria-controls="saved-filters"
          onClick={() => setShowFilters((s) => !s)}
        >
          {showFilters ? ft('hideFilters') : ft('showFilters')}
        </Button>
      </div>
      <div className="flex flex-col-reverse gap-sm md:flex-row">
        <div className={`flex flex-col gap-sm ${showFilters ? 'md:w-3/5 xl:w-2/3' : 'w-full'}`}>
          {items.length === 0 && <p className="mt-2 text-sm text-gray-500">{t('EmptySavedPage')}</p>}
          <FilteredList
            gridClassName={`grid grid-cols-1 items-stretch gap-sm sm:grid-cols-2 ${showFilters ? '' : 'lg:grid-cols-3'}`}
            items={items}
          />
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-4" />}
        </div>
        <div id="saved-filters" className={`${showFilters ? 'md:w-2/5 xl:w-1/3' : 'hidden'}`}>
          <Filter variant="card" useFilters={useSavedFilters} />
        </div>
      </div>
    </div>
  )
}
