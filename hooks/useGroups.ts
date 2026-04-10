'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { useAdminCompany } from '@/context/adminCompanyContext'
import { getMyCompany } from '@/requests/companies'
import { getGroups, getGroupsAdmin } from '@/requests/groups'
import { GroupEntity } from '@/types/company'
import { CustomSession } from '@/types/auth'

export function useGroups(resolvedCompanyId?: string) {
  const { data, status } = useSession()
  const { companyId: adminCompanyId } = useAdminCompany()
  const [items, setItems] = useState<GroupEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(resolvedCompanyId ?? null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const session = data as CustomSession
      let res: { data: GroupEntity[] } | { error: string }
      if (adminCompanyId) {
        res = await getGroupsAdmin(session, adminCompanyId)
      } else {
        let effectiveCompanyId = resolvedCompanyId
        if (!effectiveCompanyId) {
          const myCompanyRes = await getMyCompany(session)
          if ('error' in myCompanyRes) throw new Error(myCompanyRes.error)
          effectiveCompanyId = myCompanyRes.data.id
        }
        setCompanyId(effectiveCompanyId)
        res = await getGroups(session, effectiveCompanyId)
      }
      if ('error' in res) throw new Error(res.error)
      setItems(res.data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load groups')
    } finally {
      setLoading(false)
    }
  }, [data, adminCompanyId, resolvedCompanyId])

  useEffect(() => {
    if (status === 'authenticated') fetch()
    else if (status === 'unauthenticated') {
      setItems([])
      setError(null)
      setLoading(false)
    }
  }, [fetch, status])

  const addGroup = (group: GroupEntity) => setItems((prev) => [...prev, group])
  const removeGroup = (id: string) => setItems((prev) => prev.filter((g) => g.id !== id))
  const updateGroup = (updated: GroupEntity) => setItems((prev) => prev.map((g) => (g.id === updated.id ? updated : g)))

  return {
    items,
    loading,
    error,
    refetch: fetch,
    addGroup,
    removeGroup,
    updateGroup,
    companyId: adminCompanyId ?? companyId,
  }
}
