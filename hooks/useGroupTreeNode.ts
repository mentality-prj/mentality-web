'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { useAdminCompany } from '@/context/adminCompanyContext'
import { getDescendantIds } from '@/helpers/company.helpers'
import {
  createGroup,
  createGroupAdmin,
  deleteGroup,
  deleteGroupAdmin,
  updateGroup,
  updateGroupAdmin,
} from '@/requests/groups'
import { CustomSession } from '@/types/auth'
import { GroupEntity, GroupType } from '@/types/company'

export function useGroupTreeNode(
  group: GroupEntity,
  allGroups: GroupEntity[],
  callbacks: { onAdded: () => void; onUpdated: () => void; onDeleted: () => void },
  companyId?: string
) {
  const t = useTranslations('pages.Company.companyAdmin.groups')
  const { data } = useSession()
  const { companyId: contextCompanyId } = useAdminCompany()
  const effectiveCompanyId = companyId ?? contextCompanyId
  const [open, setOpen] = useState(true)
  const [editing, setEditing] = useState(false)
  const [addingChild, setAddingChild] = useState(false)
  const [editName, setEditName] = useState(group.name)
  const [editType, setEditType] = useState<GroupType>(group.type)
  const [editParentId, setEditParentId] = useState<string | null>(group.parentGroupId)
  const [newChildName, setNewChildName] = useState('')
  const [newChildType, setNewChildType] = useState<GroupType>('department')
  const [loading, setLoading] = useState(false)

  const descendantIds = getDescendantIds(group)
  const eligibleParents = allGroups.filter((g) => g.id !== group.id && !descendantIds.has(g.id))

  async function handleSaveEdit() {
    const trimmed = editName.trim()
    if (!trimmed || (trimmed === group.name && editType === group.type && editParentId === group.parentGroupId)) {
      setEditing(false)
      return
    }
    setLoading(true)
    const session = data as CustomSession
    const res = effectiveCompanyId
      ? await updateGroupAdmin(session, effectiveCompanyId, group.id, {
          name: trimmed,
          type: editType,
          parentGroupId: editParentId,
        })
      : await updateGroup(session, group.id, { name: trimmed, type: editType, parentGroupId: editParentId })
    setLoading(false)
    if ('error' in res) {
      toast.error(res.error)
      return
    }
    toast.success(t('updated'))
    setEditing(false)
    callbacks.onUpdated()
  }

  async function handleDelete() {
    if (!confirm(t('deleteConfirm', { name: group.name }))) return
    setLoading(true)
    const session = data as CustomSession
    const res = effectiveCompanyId
      ? await deleteGroupAdmin(session, effectiveCompanyId, group.id)
      : await deleteGroup(session, group.id)
    setLoading(false)
    if ('error' in res) {
      toast.error(res.error)
      return
    }
    toast.success(t('deleted'))
    callbacks.onDeleted()
  }

  async function handleAddChild() {
    const trimmed = newChildName.trim()
    if (!trimmed) return
    setLoading(true)
    const dto = { name: trimmed, type: newChildType, parentGroupId: group.id }
    const session = data as CustomSession
    const res = effectiveCompanyId
      ? await createGroupAdmin(session, effectiveCompanyId, dto)
      : await createGroup(session, dto)
    setLoading(false)
    if ('error' in res) {
      toast.error(res.error)
      return
    }
    toast.success(t('created'))
    setNewChildName('')
    setAddingChild(false)
    setOpen(true)
    callbacks.onAdded()
  }

  function startEditing() {
    setEditName(group.name)
    setEditType(group.type)
    setEditParentId(group.parentGroupId)
    setEditing(true)
  }

  function cancelEditing() {
    setEditing(false)
  }

  function cancelAddingChild() {
    setAddingChild(false)
  }

  return {
    open,
    setOpen,
    editing,
    addingChild,
    setAddingChild,
    editName,
    setEditName,
    editType,
    setEditType,
    editParentId,
    setEditParentId,
    newChildName,
    setNewChildName,
    newChildType,
    setNewChildType,
    loading,
    eligibleParents,
    handleSaveEdit,
    handleDelete,
    handleAddChild,
    startEditing,
    cancelEditing,
    cancelAddingChild,
  }
}
