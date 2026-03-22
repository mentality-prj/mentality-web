'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import Card from '@/components/shared/Cards/Card'
import { Filter } from '@/components/shared/Filter/Filter'
import { Pagination } from '@/components/shared/Pagination/Pagination'
import { PAGE_SIZE } from '@/constants/pagination'
import { useSavedFilters } from '@/context/savedFilterContext'
import { extractPaginationTotal } from '@/lib/http'
import { logger } from '@/lib/logger'
import { getFavorites } from '@/requests/favorites'
import { FavoriteEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'

import { FilteredList } from './FilteredList'

export const SavedList = () => {
  const t = useTranslations('common.title')
  const [items, setItems] = useState<FavoriteEntity[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(PAGE_SIZE)
  const [total, setTotal] = useState(0)

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
    <div className="">
      {items.length > 0 ? (
        <>
          <Filter useFilters={useSavedFilters} />
          <FilteredList items={items} />

          <Pagination
            page={page}
            totalPages={Math.max(1, Math.ceil(total / limit))}
            onPageChange={setPage}
            className="mt-4"
          />
        </>
      ) : (
        <Card type="base">{t('EmptySavedPage')}</Card>
      )}
    </div>
  )
}
