'use client'

import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useGroupTreeNode } from '@/hooks/useGroupTreeNode'
import { cn } from '@/lib/utils'
import { GroupEntity, GroupType } from '@/types/company'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

type Props = {
  group: GroupEntity
  companyId?: string
  allGroups: GroupEntity[]
  onAdded: () => void
  onUpdated: () => void
  onDeleted: () => void
}

export function GroupTreeNode({ group, companyId, allGroups, onAdded, onUpdated, onDeleted }: Props) {
  const t = useTranslations('pages.Company.companyAdmin.groups')
  const tButtons = useTranslations('common.Buttons')
  const {
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
  } = useGroupTreeNode(group, allGroups, { onAdded, onUpdated, onDeleted }, companyId)

  return (
    <li className="text-sm">
      <div className="group inline-flex items-center gap-1 rounded-md px-1 py-1 hover:bg-background-alt">
        <button
          type="button"
          aria-label={open ? t('collapse') : t('expand')}
          onClick={() => setOpen((o) => !o)}
          className="shrink-0 text-textcolor-secondary"
        >
          {group.children.length > 0 ? (
            open ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )
          ) : (
            <span className="inline-block w-3.5" />
          )}
        </button>

        {editing ? (
          <div className="flex flex-wrap items-center gap-1">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="h-7 min-w-32 text-xs"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit()
                if (e.key === 'Escape') cancelEditing()
              }}
            />
            <Select value={editType} onValueChange={(v) => setEditType(v as GroupType)}>
              <SelectTrigger className="h-7 w-32 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="department">{t('typeDepartment')}</SelectItem>
                <SelectItem value="team">{t('typeTeam')}</SelectItem>
                <SelectItem value="project">{t('typeProject')}</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={editParentId ?? '__none__'}
              onValueChange={(v) => setEditParentId(v === '__none__' ? null : v)}
            >
              <SelectTrigger className="h-7 w-40 text-xs">
                <SelectValue placeholder={t('parentPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">{t('parentPlaceholder')}</SelectItem>
                {eligibleParents.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="small" variant="ghost" onClick={handleSaveEdit} disabled={loading} className="h-7 px-2">
              {tButtons('save')}
            </Button>
            <Button size="small" variant="ghost" onClick={cancelEditing} className="h-7 px-2">
              {tButtons('cancel')}
            </Button>
          </div>
        ) : (
          <>
            <span className="flex-1 font-medium">{group.name}</span>
            <div className="invisible ml-auto flex items-center gap-0.5 group-hover:visible">
              <Button
                size="small"
                variant="ghost"
                className="h-6 w-6 p-0"
                aria-label={t('ariaAddSubGroup')}
                onClick={() => setAddingChild(true)}
              >
                <Plus size={12} />
              </Button>
              <Button
                size="small"
                variant="ghost"
                className="h-6 w-6 p-0"
                aria-label={t('ariaEdit')}
                onClick={startEditing}
              >
                <Pencil size={12} />
              </Button>
              {group.children.length === 0 && (
                <Button
                  size="small"
                  variant="ghost"
                  className="text-destructive hover:text-destructive h-6 w-6 p-0"
                  aria-label={t('ariaDelete')}
                  onClick={handleDelete}
                  disabled={loading}
                >
                  <Trash2 size={12} />
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      {addingChild && (
        <div className="ml-5 mt-1 flex flex-wrap items-center gap-1">
          <Input
            placeholder={t('subGroupPlaceholder')}
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            className="h-7 text-xs"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddChild()
              if (e.key === 'Escape') cancelAddingChild()
            }}
          />
          <Select value={newChildType} onValueChange={(v) => setNewChildType(v as GroupType)}>
            <SelectTrigger className="h-7 w-32 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="department">{t('typeDepartment')}</SelectItem>
              <SelectItem value="team">{t('typeTeam')}</SelectItem>
              <SelectItem value="project">{t('typeProject')}</SelectItem>
            </SelectContent>
          </Select>
          <Button size="small" onClick={handleAddChild} disabled={loading || !newChildName.trim()} className="h-7 px-2">
            {tButtons('add')}
          </Button>
          <Button size="small" variant="ghost" onClick={cancelAddingChild} className="h-7 px-2">
            {tButtons('cancel')}
          </Button>
        </div>
      )}

      {open && group.children.length > 0 && (
        <ul className={cn('ml-5 mt-0.5 border-l border-border pl-2')}>
          {group.children.map((child) => (
            <GroupTreeNode
              key={child.id}
              group={child}
              companyId={companyId}
              allGroups={allGroups}
              onAdded={onAdded}
              onUpdated={onUpdated}
              onDeleted={onDeleted}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
