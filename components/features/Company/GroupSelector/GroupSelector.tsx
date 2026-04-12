'use client'

import { useId, useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { CustomInput } from '@/ds/components/CustomInput'
import { computeVisibleSet } from '@/helpers/company.helpers'
import { cn } from '@/lib/utils'
import { flattenGroups } from '@/mappers/group.mappers'
import { GroupEntity } from '@/types/company'
import { Checkbox } from '@/ui/checkbox'

type GroupSelectorProps = {
  groups: GroupEntity[]
  selected: string[]
  onChange: (ids: string[]) => void
  /** IDs the current user cannot access — rendered as disabled */
  disabledIds?: string[]
  /** Allow selecting only one group */
  singleSelect?: boolean
}

type TreeNodeProps = {
  group: GroupEntity
  selected: string[]
  disabledSet: Set<string>
  onToggle: (id: string) => void
  visibleSet: Set<string>
  t: (key: string) => string
}

function TreeNode({ group, selected, disabledSet, onToggle, visibleSet, t }: TreeNodeProps) {
  const [open, setOpen] = useState(true)
  const isDisabled = disabledSet.has(group.id)
  const isChecked = selected.includes(group.id)
  const hasChildren = group.children.length > 0

  if (visibleSet.size > 0 && !visibleSet.has(group.id)) return null

  return (
    <li>
      <div
        className={cn(
          'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm',
          isDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-background-alt'
        )}
      >
        {hasChildren ? (
          <button
            type="button"
            aria-label={open ? t('collapse') : t('expand')}
            onClick={() => setOpen((o) => !o)}
            className="shrink-0 text-textcolor-secondary"
          >
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="w-[14px] shrink-0" />
        )}

        <Checkbox
          id={`group-${group.id}`}
          checked={isChecked}
          disabled={isDisabled}
          onCheckedChange={() => !isDisabled && onToggle(group.id)}
        />
        <label
          htmlFor={`group-${group.id}`}
          className={cn('select-none', isDisabled ? 'cursor-not-allowed' : 'cursor-pointer')}
        >
          {group.name}
        </label>
      </div>

      {hasChildren && open && (
        <ul className="ml-5 border-l border-border pl-2">
          {group.children.map((child) => (
            <TreeNode
              key={child.id}
              group={child}
              selected={selected}
              disabledSet={disabledSet}
              onToggle={onToggle}
              visibleSet={visibleSet}
              t={t}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export function GroupSelector({
  groups,
  selected,
  onChange,
  disabledIds = [],
  singleSelect = false,
}: GroupSelectorProps) {
  const [query, setQuery] = useState('')
  const searchId = useId()
  const t = useTranslations('pages.Company.groupSelector')
  const disabledSet = useMemo(() => new Set(disabledIds), [disabledIds])

  const matchSet = useMemo<Set<string>>(() => {
    if (!query.trim()) return new Set()
    const q = query.toLowerCase()
    const flat = flattenGroups(groups)
    return new Set(flat.filter((g) => g.name.toLowerCase().includes(q)).map((g) => g.id))
  }, [query, groups])

  const visibleSet = useMemo(() => {
    if (matchSet.size === 0) return new Set<string>()
    return computeVisibleSet(groups, matchSet)
  }, [groups, matchSet])

  function toggle(id: string) {
    if (singleSelect) {
      onChange(selected.includes(id) ? [] : [id])
      return
    }
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id])
  }

  if (groups.length === 0) {
    return <p className="text-sm text-textcolor-secondary">{t('empty')}</p>
  }

  return (
    <div className="flex flex-col gap-2">
      <CustomInput
        id={searchId}
        placeholder={t('searchPlaceholder')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label={t('searchLabel')}
        rightIcon={query ? <X size={14} /> : undefined}
        onRightClick={() => setQuery('')}
        className="bg-white"
      />

      <ul className="scrollbar-styled max-h-52 overflow-y-auto rounded-md border border-border p-1">
        {groups.map((g) => (
          <TreeNode
            key={g.id}
            group={g}
            selected={selected}
            disabledSet={disabledSet}
            onToggle={toggle}
            visibleSet={visibleSet}
            t={t}
          />
        ))}
      </ul>

      {selected.length > 0 && (
        <p className="text-xs text-textcolor-secondary">
          {t(selected.length === 1 ? 'selected' : 'selectedPlural', { count: selected.length })}
        </p>
      )}
    </div>
  )
}
