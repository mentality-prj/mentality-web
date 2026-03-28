'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { getInvites, resendInvite, cancelInvite } from '@/requests/invites'
import { InviteEntity, PaginatedInvites } from '@/types/company'
import { CustomSession } from '@/types/auth'

export function useInvites(page = 1) {
  const { data, status } = useSession()
  const [items, setItems] = useState<InviteEntity[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const session = data as CustomSession
      const res = await getInvites(session, page)
      if ('error' in res) throw new Error(res.error)
      const paginated = res.data as PaginatedInvites
      setItems(paginated.items)
      setTotal(paginated.total)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load invites')
    } finally {
      setLoading(false)
    }
  }, [data, page])

  useEffect(() => {
    if (status === 'authenticated') fetch()
    else if (status === 'unauthenticated') {
      setItems([])
      setTotal(0)
      setError(null)
      setLoading(false)
    }
  }, [fetch, status])

  const handleResend = useCallback(
    async (id: string) => {
      const session = data as CustomSession
      const res = await resendInvite(session, id)
      if ('error' in res) return { error: res.error }
      return { data: res.data }
    },
    [data]
  )

  const handleCancel = useCallback(
    async (id: string) => {
      const session = data as CustomSession
      const res = await cancelInvite(session, id)
      if ('error' in res) return { error: res.error }
      setItems((prev) => prev.filter((i) => i.id !== id))
      setTotal((t) => Math.max(0, t - 1))
      return { data: res.data }
    },
    [data]
  )

  return { items, total, loading, error, refetch: fetch, handleResend, handleCancel }
}
