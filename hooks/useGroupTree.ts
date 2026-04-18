'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthProvider'
import { useTranslations } from 'next-intl'

import { useAdminCompany } from '@/context/adminCompanyContext'
import { useGroups } from '@/hooks/useGroups'
import { buildTree, flattenGroups } from '@/mappers/group.mappers'
import { createGroup, createGroupAdmin } from '@/requests/groups'
import { CustomSession } from '@/types/auth'
import { GroupType } from '@/types/company'

export function useGroupTree() {
  const t = useTranslations('pages.Company.companyAdmin.groups')
  const { session: data } = useAuth()
  const { companyId: adminCompanyId } = useAdminCompany()
  const { items, loading, error, refetch, companyId } = useGroups()
  const [newRootName, setNewRootName] = useState('')
  const [newRootType, setNewRootType] = useState<GroupType>('department')
  const [newRootParentId, setNewRootParentId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [creating, setCreating] = useState(false)

  const hasPrebuiltChildren = items.some((g) => Array.isArray(g.children) && g.children.length > 0)
  const roots = hasPrebuiltChildren ? items : buildTree(items)
  const flat = flattenGroups(roots)

  async function handleCreateRoot() {
    const trimmed = newRootName.trim()
    if (!trimmed) return
    setCreating(true)
    const dto = { name: trimmed, type: newRootType, parentGroupId: newRootParentId }
    const session = data as CustomSession
    const res = adminCompanyId
      ? await createGroupAdmin(session, adminCompanyId, dto)
      : await createGroup(session, companyId!, dto)
    setCreating(false)
    if ('error' in res) {
      toast.error(res.error)
      return
    }
    toast.success(t('created'))
    setNewRootName('')
    setNewRootParentId(null)
    setAdding(false)
    refetch()
  }

  function resetAdding() {
    setAdding(false)
  }

  return {
    items,
    loading,
    error,
    roots,
    flat,
    adding,
    setAdding,
    creating,
    newRootName,
    setNewRootName,
    newRootType,
    setNewRootType,
    newRootParentId,
    setNewRootParentId,
    handleCreateRoot,
    resetAdding,
    refetch,
    companyId,
  }
}
