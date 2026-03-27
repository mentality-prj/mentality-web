'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, Search } from 'lucide-react'

import { cn } from '@/lib/utils'
import { flattenGroups } from '@/mappers/group.mappers'
import { GroupEntity } from '@/types/company'
import { Input } from '@/ui/input'

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
  matchSet: Set<string>
}

function TreeNode({ group, selected, disabledSet, onToggle, matchSet }: TreeNodeProps) {
  const [open, setOpen] = useState(true)
  const isDisabled = disabledSet.has(group.id)
  const isChecked = selected.includes(group.id)
  const hasChildren = group.children.length > 0

  // Show node when it or any descendant matches
  const descendantMatch = useMemo(() => {
    if (matchSet.size === 0) return true
    const flat = flattenGroups([group])
    return flat.some((g) => matchSet.has(g.id))
  }, [group, matchSet])

  if (!descendantMatch) return null

  return (
    <li>
      <div
        className={cn(
          'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm',
          isDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-accent'
        )}
      >
        {hasChildren ? (
          <button
            type="button"
            aria-label={open ? 'Collapse' : 'Expand'}
            onClick={() => setOpen((o) => !o)}
            className="shrink-0 text-textcolor-secondary"
          >
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="w-[14px] shrink-0" />
        )}

        <input
          type="checkbox"
          id={`group-${group.id}`}
          checked={isChecked}
          disabled={isDisabled}
          onChange={() => !isDisabled && onToggle(group.id)}
          className="accent-primary"
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
              matchSet={matchSet}
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
  const disabledSet = useMemo(() => new Set(disabledIds), [disabledIds])

  const matchSet = useMemo<Set<string>>(() => {
    if (!query.trim()) return new Set()
    const q = query.toLowerCase()
    const flat = flattenGroups(groups)
    return new Set(flat.filter((g) => g.name.toLowerCase().includes(q)).map((g) => g.id))
  }, [query, groups])

  function toggle(id: string) {
    if (singleSelect) {
      onChange(selected.includes(id) ? [] : [id])
      return
    }
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id])
  }

  if (groups.length === 0) {
    return <p className="text-sm text-textcolor-secondary">No groups available.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-textcolor-secondary" />
        <Input
          placeholder="Search groups…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-8 text-sm"
          aria-label="Search groups"
        />
      </div>

      <ul className="max-h-64 overflow-y-auto rounded-md border border-border p-1">
        {groups.map((g) => (
          <TreeNode
            key={g.id}
            group={g}
            selected={selected}
            disabledSet={disabledSet}
            onToggle={toggle}
            matchSet={matchSet}
          />
        ))}
      </ul>

      {selected.length > 0 && (
        <p className="text-xs text-textcolor-secondary">
          {selected.length} group{selected.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  )
}
