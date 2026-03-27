'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { getGroups, getAccessibleGroups } from '@/requests/groups'
import { GroupEntity } from '@/types/company'
import { CustomSession } from '@/types/auth'

export function useGroups(accessibleOnly = false) {
  const { data, status } = useSession()
  const [items, setItems] = useState<GroupEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const session = data as CustomSession
      const res = accessibleOnly ? await getAccessibleGroups(session) : await getGroups(session)
      if ('error' in res) throw new Error(res.error)
      setItems(res.data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load groups')
    } finally {
      setLoading(false)
    }
  }, [data, accessibleOnly])

  useEffect(() => {
    if (status === 'authenticated') fetch()
    else {
      setItems([])
      setLoading(false)
    }
  }, [fetch, status])

  const addGroup = (group: GroupEntity) => setItems((prev) => [...prev, group])
  const removeGroup = (id: string) => setItems((prev) => prev.filter((g) => g.id !== id))
  const updateGroup = (updated: GroupEntity) => setItems((prev) => prev.map((g) => (g.id === updated.id ? updated : g)))

  return { items, loading, error, refetch: fetch, addGroup, removeGroup, updateGroup }
}
