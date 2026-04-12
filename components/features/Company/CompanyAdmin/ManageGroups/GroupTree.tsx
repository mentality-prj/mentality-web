'use client'

import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useGroupTree } from '@/hooks/useGroupTree'
import { GroupType } from '@/types/company'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

import { GroupTreeNode } from './GroupTreeNode'

export function GroupTree() {
  const t = useTranslations('pages.Company.companyAdmin.groups')
  const tButtons = useTranslations('common.Buttons')
  const {
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
  } = useGroupTree()

  if (loading) return <p className="text-sm text-textcolor-secondary">{t('loading')}</p>
  if (error) return <p className="text-destructive text-sm">{error}</p>

  return (
    <div className="flex flex-col gap-xs">
      <div className="flex items-center justify-between">
        {!adding && (
          <Button size="small" variant="secondary" onClick={() => setAdding(true)} className="gap-1">
            <Plus size={14} /> {t('newGroup')}
          </Button>
        )}
      </div>

      {adding && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-3">
          <Input
            placeholder={t('rootPlaceholder')}
            value={newRootName}
            onChange={(e) => setNewRootName(e.target.value)}
            className="h-8 min-w-40 flex-1 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateRoot()
              if (e.key === 'Escape') resetAdding()
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
          <Button size="small" variant="ghost" onClick={resetAdding}>
            {tButtons('cancel')}
          </Button>
        </div>
      )}

      {items.length === 0 && !adding && <p className="text-sm text-textcolor-secondary">{t('empty')}</p>}

      <ul className="flex flex-col gap-1">
        {roots.map((group) => (
          <GroupTreeNode
            key={group.id}
            group={group}
            companyId={companyId ?? undefined}
            allGroups={flat}
            onAdded={refetch}
            onUpdated={refetch}
            onDeleted={refetch}
          />
        ))}
      </ul>
    </div>
  )
}
