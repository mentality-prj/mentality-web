'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'

import { cn } from '@/lib/utils'
import { createGroup, deleteGroup, updateGroup } from '@/requests/groups'
import { CustomSession } from '@/types/auth'
import { GroupEntity } from '@/types/company'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'

type Props = {
  group: GroupEntity
  onAdded: (group: GroupEntity) => void
  onUpdated: (group: GroupEntity) => void
  onDeleted: (id: string) => void
}

export function GroupTreeNode({ group, onAdded, onUpdated, onDeleted }: Props) {
  const { data } = useSession()
  const [open, setOpen] = useState(true)
  const [editing, setEditing] = useState(false)
  const [addingChild, setAddingChild] = useState(false)
  const [editName, setEditName] = useState(group.name)
  const [newChildName, setNewChildName] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSaveEdit() {
    const trimmed = editName.trim()
    if (!trimmed || trimmed === group.name) {
      setEditing(false)
      return
    }
    setLoading(true)
    const res = await updateGroup(data as CustomSession, group.id, { name: trimmed })
    setLoading(false)
    if ('error' in res) {
      toast.error(res.error)
      return
    }
    toast.success('Group updated.')
    setEditing(false)
    onUpdated(res.data)
  }

  async function handleDelete() {
    if (!confirm(`Delete group "${group.name}"? This cannot be undone.`)) return
    setLoading(true)
    const res = await deleteGroup(data as CustomSession, group.id)
    setLoading(false)
    if ('error' in res) {
      toast.error(res.error)
      return
    }
    toast.success('Group deleted.')
    onDeleted(group.id)
  }

  async function handleAddChild() {
    const trimmed = newChildName.trim()
    if (!trimmed) return
    setLoading(true)
    const res = await createGroup(data as CustomSession, { name: trimmed, parentId: group.id })
    setLoading(false)
    if ('error' in res) {
      toast.error(res.error)
      return
    }
    toast.success('Group created.')
    setNewChildName('')
    setAddingChild(false)
    onAdded(res.data)
  }

  return (
    <li className="text-sm">
      <div className="group flex items-center gap-1 rounded-md px-1 py-1 hover:bg-accent">
        <button
          type="button"
          aria-label={open ? 'Collapse' : 'Expand'}
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
          <div className="flex flex-1 items-center gap-1">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="h-7 text-xs"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit()
                if (e.key === 'Escape') setEditing(false)
              }}
            />
            <Button size="small" variant="ghost" onClick={handleSaveEdit} disabled={loading} className="h-7 px-2">
              Save
            </Button>
            <Button size="small" variant="ghost" onClick={() => setEditing(false)} className="h-7 px-2">
              Cancel
            </Button>
          </div>
        ) : (
          <>
            <span className="flex-1 font-medium">{group.name}</span>
            <div className="ml-auto hidden items-center gap-0.5 group-hover:flex">
              <Button
                size="small"
                variant="ghost"
                className="h-6 w-6 p-0"
                aria-label="Add sub-group"
                onClick={() => setAddingChild(true)}
              >
                <Plus size={12} />
              </Button>
              <Button
                size="small"
                variant="ghost"
                className="h-6 w-6 p-0"
                aria-label="Edit group"
                onClick={() => {
                  setEditName(group.name)
                  setEditing(true)
                }}
              >
                <Pencil size={12} />
              </Button>
              <Button
                size="small"
                variant="ghost"
                className="text-destructive hover:text-destructive h-6 w-6 p-0"
                aria-label="Delete group"
                onClick={handleDelete}
                disabled={loading}
              >
                <Trash2 size={12} />
              </Button>
            </div>
          </>
        )}
      </div>

      {addingChild && (
        <div className="ml-5 mt-1 flex items-center gap-1">
          <Input
            placeholder="Sub-group name"
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            className="h-7 text-xs"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddChild()
              if (e.key === 'Escape') setAddingChild(false)
            }}
          />
          <Button size="small" onClick={handleAddChild} disabled={loading || !newChildName.trim()} className="h-7 px-2">
            Add
          </Button>
          <Button size="small" variant="ghost" onClick={() => setAddingChild(false)} className="h-7 px-2">
            Cancel
          </Button>
        </div>
      )}

      {open && group.children.length > 0 && (
        <ul className={cn('ml-5 mt-0.5 border-l border-border pl-2')}>
          {group.children.map((child) => (
            <GroupTreeNode key={child.id} group={child} onAdded={onAdded} onUpdated={onUpdated} onDeleted={onDeleted} />
          ))}
        </ul>
      )}
    </li>
  )
}
