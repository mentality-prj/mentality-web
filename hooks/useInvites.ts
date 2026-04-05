'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { COMPANY_PAGE_SIZE } from '@/constants/company'
import { useAdminCompany } from '@/context/adminCompanyContext'
import {
  cancelInvite,
  cancelInviteAdmin,
  getInvites,
  getInvitesAdmin,
  resendInvite,
  resendInviteAdmin,
} from '@/requests/invites'
import { CustomSession } from '@/types/auth'
import { InviteEntity, PaginatedInvites } from '@/types/company'

export function useInvites() {
  const { data, status } = useSession()
  const { companyId: adminCompanyId } = useAdminCompany()
  const [items, setItems] = useState<InviteEntity[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setPage(1)
    setItems([])
    setTotal(0)
  }, [adminCompanyId])

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const session = data as CustomSession
      const res = adminCompanyId
        ? await getInvitesAdmin(session, adminCompanyId, page, COMPANY_PAGE_SIZE)
        : await getInvites(session, page, COMPANY_PAGE_SIZE)
      if ('error' in res) throw new Error(res.error)
      const paginated = res.data as PaginatedInvites
      setItems(paginated.items)
      setTotal(paginated.total)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load invites')
    } finally {
      setLoading(false)
    }
  }, [data, page, adminCompanyId])

  useEffect(() => {
    if (status === 'unauthenticated') {
      setItems([])
      setTotal(0)
      setPage(1)
      setError(null)
      setLoading(false)
      return
    }
    if (status === 'authenticated') fetch()
  }, [fetch, status])

  const handleResend = useCallback(
    async (id: string) => {
      const session = data as CustomSession
      const res = adminCompanyId
        ? await resendInviteAdmin(session, adminCompanyId, id)
        : await resendInvite(session, id)
      if ('error' in res) return { error: res.error }
      const updatedInvite = res.data as InviteEntity
      setItems((prev) => prev.map((invite) => (invite.id === updatedInvite.id ? updatedInvite : invite)))
      return { data: updatedInvite }
    },
    [data, adminCompanyId]
  )

  const handleCancel = useCallback(
    async (id: string) => {
      const session = data as CustomSession
      const res = adminCompanyId
        ? await cancelInviteAdmin(session, adminCompanyId, id)
        : await cancelInvite(session, id)
      if ('error' in res) return { error: res.error }
      setItems((prev) => prev.filter((i) => i.id !== id))
      setTotal((t) => Math.max(0, t - 1))
      return { data: res.data }
    },
    [data, adminCompanyId]
  )

  return { items, total, page, setPage, loading, error, refetch: fetch, handleResend, handleCancel }
}
