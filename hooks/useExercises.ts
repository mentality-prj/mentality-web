'use client'
import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { ADMIN_PAGE_SIZE } from '@/constants/pagination'
import { getCorrectedExercises, getExercises, getUnpublishedExercises } from '@/requests/exercises'
import { ExerciseEntity, PaginatedExercises } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'

export default function useExercises(
  fetchUnpublished = false,
  page = 1,
  reloadTrigger?: number,
  fetchCorrected = false
) {
  const { data, status } = useSession()
  const [items, setItems] = useState<ExerciseEntity[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPage = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const sessionData = data as CustomSession
      let res: { data: PaginatedExercises } | { error: string }

      if (fetchUnpublished) {
        res = await getUnpublishedExercises(sessionData, page, ADMIN_PAGE_SIZE)
      } else if (fetchCorrected) {
        const r = await getCorrectedExercises(sessionData)
        if ('error' in r) throw new Error(r.error)
        // Server does not support pagination for corrected exercises: perform client-side pagination
        const allItems = Array.isArray(r.data) ? r.data : []
        const totalItems = allItems.length
        const start = (page - 1) * ADMIN_PAGE_SIZE
        const pagedItems = allItems.slice(start, start + ADMIN_PAGE_SIZE)
        res = { data: { items: pagedItems, total: totalItems } }
      } else {
        const r = await getExercises(sessionData)
        if ('error' in r) throw new Error(r.error)
        // Convert to paginated shape
        res = { data: { items: r.data ?? [], total: Array.isArray(r.data) ? r.data.length : 0 } }
      }

      if ('error' in res) {
        throw new Error(res.error)
      }

      const paginated = res.data as PaginatedExercises
      const list = Array.isArray(paginated?.items) ? paginated.items : []
      const totalCount = typeof paginated?.total === 'number' ? paginated.total : list.length
      setItems(list)
      setTotal(totalCount)
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message)
      else setError('Error fetching exercises')
    } finally {
      setLoading(false)
    }
  }, [data, fetchUnpublished, fetchCorrected, page])

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
