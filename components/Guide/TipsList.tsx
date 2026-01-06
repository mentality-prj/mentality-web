'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import Card from '@/components/Cards/Card'
import Loading from '@/components/Loading'
import Pagination from '@/components/Pagination/Pagination'
import { ADMIN_PAGE_SIZE } from '@/constants/pagination'
import { getUnpublishedTips } from '@/requests/tips'
import { TipEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'

export default function TipsList() {
  const { data, status } = useSession()
  const [items, setItems] = useState<TipEntity[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      setLoading(true)
      setError(null)
      try {
        const session = data as CustomSession
        const res = await getUnpublishedTips(session)
        if ('error' in res) throw new Error(res.error)
        if (!cancelled) setItems(res.data?.items ?? [])
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (status === 'authenticated') fetch()
    else {
      setItems([])
      setLoading(false)
    }

    return () => {
      cancelled = true
    }
  }, [status, data])

  const totalPages = Math.max(1, Math.ceil(items.length / ADMIN_PAGE_SIZE))
  const pageItems = items.slice((page - 1) * ADMIN_PAGE_SIZE, page * ADMIN_PAGE_SIZE)

  if (loading) return <Loading size={18} className="text-gray-500" />
  if (error) return <div className="text-sm text-red-500">{error}</div>

  return (
    <div>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((t) => (
          <li key={t.id}>
            <Card title={t.translations?.en || ''} aftertext={t.translations?.uk} />
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  )
}
