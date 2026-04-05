'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { GroupTreeNode } from '@/components/features/Company/CompanyAdmin/ManageGroups/GroupTreeNode'
import { buildTree, flattenGroups } from '@/mappers/group.mappers'
import { adminCreateGroup, adminGetGroups } from '@/requests/companyAdmin'
import { CustomSession } from '@/types/auth'
import { GroupEntity, GroupType } from '@/types/company'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

type Props = {
  companyId: string
  initialGroups?: GroupEntity[]
}

export function AdminGroupTree({ companyId, initialGroups }: Props) {
  const t = useTranslations('pages.Company.companyAdmin.groups')
  const tButtons = useTranslations('common.Buttons')
  const { data, status } = useSession()
  const [items, setItems] = useState<GroupEntity[]>(() => initialGroups ?? [])
  const [loading, setLoading] = useState(initialGroups === undefined)
  const [error, setError] = useState<string | null>(null)
  const [newRootName, setNewRootName] = useState('')
  const [newRootType, setNewRootType] = useState<GroupType>('department')
  const [newRootParentId, setNewRootParentId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [creating, setCreating] = useState(false)

  const fetchGroups = useCallback(async () => {
    setLoading(true)
    setError(null)
    const res = await adminGetGroups(data as CustomSession, companyId)
    if ('error' in res) {
      setError(res.error)
    } else {
      setItems(res.data)
    }
    setLoading(false)
  }, [data, companyId])

  useEffect(() => {
    if (initialGroups !== undefined) return
    if (status === 'authenticated') fetchGroups()
    else if (status === 'unauthenticated') {
      setItems([])
      setLoading(false)
    }
  }, [fetchGroups, status, initialGroups])

  async function handleCreateRoot() {
    const trimmed = newRootName.trim()
    if (!trimmed) return
    setCreating(true)
    const res = await adminCreateGroup(data as CustomSession, companyId, {
      name: trimmed,
      type: newRootType,
      parentGroupId: newRootParentId,
    })
    setCreating(false)
    if ('error' in res) {
      toast.error(res.error)
      return
    }
    toast.success(t('created'))
    setNewRootName('')
    setNewRootParentId(null)
    setAdding(false)
    fetchGroups()
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {!adding && (
          <Button size="small" variant="secondary" onClick={() => setAdding(true)} className="gap-1">
            <Plus size={14} /> {t('newGroup')}
          </Button>
        )}
      </div>

      {adding &&
        (() => {
          const flat = flattenGroups(items)
          return (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-3">
              <Input
                placeholder={t('rootPlaceholder')}
                value={newRootName}
                onChange={(e) => setNewRootName(e.target.value)}
                className="h-8 min-w-40 flex-1 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateRoot()
                  if (e.key === 'Escape') setAdding(false)
                }}
              />
              <Select value={newRootType} onValueChange={(v) => setNewRootType(v as GroupType)}>
                <SelectTrigger className="h-8 w-36 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="department">{t('typeDepartment')}</SelectItem>
                  <SelectItem value="team">{t('typeTeam')}</SelectItem>
                  <SelectItem value="project">{t('typeProject')}</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={newRootParentId ?? '__none__'}
                onValueChange={(v) => setNewRootParentId(v === '__none__' ? null : v)}
              >
                <SelectTrigger className="h-8 w-48 text-sm">
                  <SelectValue placeholder={t('parentPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">{t('parentPlaceholder')}</SelectItem>
                  {flat.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="small" onClick={handleCreateRoot} disabled={creating || !newRootName.trim()}>
                {tButtons('add')}
              </Button>
              <Button size="small" variant="ghost" onClick={() => setAdding(false)}>
                {tButtons('cancel')}
              </Button>
            </div>
          )
        })()}

      {loading && <p className="text-sm text-textcolor-secondary">{t('loading')}</p>}
      {!loading && error && <p className="text-destructive text-sm">{error}</p>}
      {!loading && !error && items.length === 0 && !adding && (
        <p className="text-sm text-textcolor-secondary">{t('empty')}</p>
      )}

      {!loading &&
        !error &&
        (() => {
          const hasPrebuiltChildren = items.some((g) => Array.isArray(g.children) && g.children.length > 0)
          const roots = hasPrebuiltChildren ? items : buildTree(items)
          const flat = flattenGroups(roots)
          return (
            <ul className="flex flex-col gap-1">
              {roots.map((group) => (
                <GroupTreeNode
                  key={group.id}
                  group={group}
                  companyId={companyId}
                  allGroups={flat}
                  onAdded={fetchGroups}
                  onUpdated={fetchGroups}
                  onDeleted={fetchGroups}
                />
              ))}
            </ul>
          )
        })()}
    </div>
  )
}
