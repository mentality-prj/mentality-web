'use client'
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthProvider'

import { ADMIN_PAGE_SIZE } from '@/constants/pagination'
import { getAffirmations, getUnpublishedAffirmations } from '@/requests/affirmations'
import { AffirmationEntity, PaginatedAffirmations } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'

export default function useAffirmations(fetchUnpublished = false, page = 1, reloadTrigger?: number) {
  const { session: data, status } = useAuth()
  const [items, setItems] = useState<AffirmationEntity[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPage = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const sessionData = data as CustomSession
      let res: { data: PaginatedAffirmations } | { error: string }

      if (fetchUnpublished) {
        res = await getUnpublishedAffirmations(sessionData, page, ADMIN_PAGE_SIZE)
      } else {
        res = await getAffirmations(sessionData, page, ADMIN_PAGE_SIZE)
      }

      if ('error' in res) {
        throw new Error(res.error)
      }

      const paginated = res.data as PaginatedAffirmations
      const newItems = Array.isArray(paginated?.items) ? paginated.items : []
      const newTotal = typeof paginated?.total === 'number' ? paginated.total : 0

      setItems(newItems)
      setTotal(newTotal)
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message)
      else setError('Error fetching')
    } finally {
      setLoading(false)
    }
  }, [data, fetchUnpublished, page])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      await fetchPage()
      if (cancelled) return
    }
    if (status === 'authenticated') run()
    else {
      setItems([])
      setTotal(0)
      setLoading(false)
    }

    return () => {
      cancelled = true
    }
  }, [fetchPage, status, reloadTrigger])

  return { items, total, loading, error, refetch: fetchPage, setItems, setTotal }
}
