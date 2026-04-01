'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { useGroups } from '@/hooks/useGroups'
import { createGroup } from '@/requests/groups'
import { CustomSession } from '@/types/auth'
import { GroupType } from '@/types/company'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

import { GroupTreeNode } from './GroupTreeNode'

export function GroupTree() {
  const t = useTranslations('pages.Company.companyAdmin.groups')
  const tButtons = useTranslations('common.Buttons')
  const { data } = useSession()
  const { items, loading, error, addGroup, refetch } = useGroups()
  const [newRootName, setNewRootName] = useState('')
  const [newRootType, setNewRootType] = useState<GroupType>('department')
  const [adding, setAdding] = useState(false)
  const [creating, setCreating] = useState(false)

  async function handleCreateRoot() {
    const trimmed = newRootName.trim()
    if (!trimmed) return
    setCreating(true)
    const res = await createGroup(data as CustomSession, { name: trimmed, type: newRootType, parentGroupId: null })
    setCreating(false)
    if ('error' in res) {
      toast.error(res.error)
      return
    }
    toast.success(t('created'))
    setNewRootName('')
    setAdding(false)
    addGroup(res.data)
  }

  if (loading) return <p className="text-sm text-textcolor-secondary">{t('loading')}</p>
  if (error) return <p className="text-destructive text-sm">{error}</p>

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{t('title')}</h3>
        <Button size="small" variant="secondary" onClick={() => setAdding(true)} className="gap-1">
          <Plus size={14} /> {t('newGroup')}
        </Button>
      </div>

      {adding && (
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder={t('rootPlaceholder')}
            value={newRootName}
            onChange={(e) => setNewRootName(e.target.value)}
            className="h-8 text-sm"
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
          <Button size="small" onClick={handleCreateRoot} disabled={creating || !newRootName.trim()}>
            {tButtons('add')}
          </Button>
          <Button size="small" variant="ghost" onClick={() => setAdding(false)}>
            {tButtons('cancel')}
          </Button>
        </div>
      )}

      {items.length === 0 && !adding && <p className="text-sm text-textcolor-secondary">{t('empty')}</p>}

      <ul className="flex flex-col gap-0.5">
        {items.map((group) => (
          <GroupTreeNode key={group.id} group={group} onAdded={refetch} onUpdated={refetch} onDeleted={refetch} />
        ))}
      </ul>
    </div>
  )
}
