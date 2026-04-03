'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { useAdminCompany } from '@/context/adminCompanyContext'
import { getGroups, getAccessibleGroups, getGroupsAdmin } from '@/requests/groups'
import { GroupEntity } from '@/types/company'
import { CustomSession } from '@/types/auth'

export function useGroups(accessibleOnly = false) {
  const { data, status } = useSession()
  const { companyId: adminCompanyId } = useAdminCompany()
  const [items, setItems] = useState<GroupEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const session = data as CustomSession
      let res: { data: GroupEntity[] } | { error: string }
      if (adminCompanyId) {
        res = await getGroupsAdmin(session, adminCompanyId)
      } else {
        res = accessibleOnly ? await getAccessibleGroups(session) : await getGroups(session)
      }
      if ('error' in res) throw new Error(res.error)
      setItems(res.data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load groups')
    } finally {
      setLoading(false)
    }
  }, [data, accessibleOnly, adminCompanyId])

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

  return { items, loading, error, refetch: fetch, addGroup, removeGroup, updateGroup }
}
