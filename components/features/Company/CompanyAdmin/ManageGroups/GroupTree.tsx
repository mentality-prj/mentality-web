'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'

import { useGroups } from '@/hooks/useGroups'
import { createGroup } from '@/requests/groups'
import { CustomSession } from '@/types/auth'
import { GroupEntity } from '@/types/company'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'

import { GroupTreeNode } from './GroupTreeNode'

export function GroupTree() {
  const { data } = useSession()
  const { items, loading, error, addGroup, removeGroup, updateGroup } = useGroups()
  const [newRootName, setNewRootName] = useState('')
  const [adding, setAdding] = useState(false)
  const [creating, setCreating] = useState(false)

  async function handleCreateRoot() {
    const trimmed = newRootName.trim()
    if (!trimmed) return
    setCreating(true)
    const res = await createGroup(data as CustomSession, { name: trimmed, parentId: null })
    setCreating(false)
    if ('error' in res) {
      toast.error(res.error)
      return
    }
    toast.success('Group created.')
    setNewRootName('')
    setAdding(false)
    addGroup(res.data)
  }

  // When a nested group is deleted, we need a deep remove
  function deepRemove(id: string) {
    removeGroup(id)
  }

  // When a nested group is updated, we need a deep update
  function deepUpdate(updated: GroupEntity) {
    updateGroup(updated)
  }

  if (loading) return <p className="text-sm text-textcolor-secondary">Loading groups…</p>
  if (error) return <p className="text-destructive text-sm">{error}</p>

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Groups</h3>
        <Button size="small" variant="secondary" onClick={() => setAdding(true)} className="gap-1">
          <Plus size={14} /> New group
        </Button>
      </div>

      {adding && (
        <div className="flex items-center gap-2">
          <Input
            placeholder="Root group name"
            value={newRootName}
            onChange={(e) => setNewRootName(e.target.value)}
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateRoot()
              if (e.key === 'Escape') setAdding(false)
            }}
          />
          <Button size="small" onClick={handleCreateRoot} disabled={creating || !newRootName.trim()}>
            Add
          </Button>
          <Button size="small" variant="ghost" onClick={() => setAdding(false)}>
            Cancel
          </Button>
        </div>
      )}

      {items.length === 0 && !adding && (
        <p className="text-sm text-textcolor-secondary">No groups yet. Create your first group.</p>
      )}

      <ul className="flex flex-col gap-0.5">
        {items.map((group) => (
          <GroupTreeNode
            key={group.id}
            group={group}
            onAdded={addGroup}
            onUpdated={deepUpdate}
            onDeleted={deepRemove}
          />
        ))}
      </ul>
    </div>
  )
}
