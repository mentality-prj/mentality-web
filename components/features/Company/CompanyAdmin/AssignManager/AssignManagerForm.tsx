'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'

import { GroupSelector } from '@/components/features/Company/GroupSelector'
import { useGroups } from '@/hooks/useGroups'
import { createAccessScope, deleteAccessScope, getAccessScopes } from '@/requests/accessScopes'
import { getEmployeesByRole } from '@/requests/employees'
import { CustomSession } from '@/types/auth'
import { AccessScopeEntity, EmployeeEntity } from '@/types/company'
import { COMPANY_ROLES } from '@/types/rbac'
import { Button } from '@/ui/button'
import { Label } from '@/ui/label'

export function AssignManagerForm() {
  const { data, status } = useSession()
  const { items: groups } = useGroups()

  const [managers, setManagers] = useState<EmployeeEntity[]>([])
  const [scopes, setScopes] = useState<AccessScopeEntity[]>([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])
  const [canViewAnalytics, setCanViewAnalytics] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userError, setUserError] = useState<string | null>(null)
  const [groupError, setGroupError] = useState<string | null>(null)

  const loadManagersAndScopes = useCallback(async () => {
    const session = data as CustomSession
    const [managersRes, scopesRes] = await Promise.all([
      getEmployeesByRole(session, COMPANY_ROLES.MANAGER),
      getAccessScopes(session),
    ])
    if (!('error' in managersRes)) {
      setManagers(managersRes.data)
    }
    if (!('error' in scopesRes)) {
      setScopes(scopesRes.data)
    }
  }, [data])

  useEffect(() => {
    if (status === 'authenticated') loadManagersAndScopes()
    else if (status === 'unauthenticated') {
      setManagers([])
      setScopes([])
    }
  }, [loadManagersAndScopes, status])

  function validate(): boolean {
    let valid = true
    if (!selectedUserId) {
      setUserError('Select a manager.')
      valid = false
    } else setUserError(null)
    if (selectedGroupIds.length === 0) {
      setGroupError('Select at least one group.')
      valid = false
    } else setGroupError(null)
    return valid
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const res = await createAccessScope(data as CustomSession, {
      userId: selectedUserId,
      groupIds: selectedGroupIds,
      canViewAnalytics,
    })
    setLoading(false)
    if ('error' in res) {
      toast.error(res.error)
      return
    }
    toast.success('Access assigned.')
    setScopes((prev) => [...prev, res.data])
    setSelectedUserId('')
    setSelectedGroupIds([])
    setCanViewAnalytics(false)
  }

  async function handleRevoke(id: string) {
    const session = data as CustomSession
    const res = await deleteAccessScope(session, id)
    if ('error' in res) {
      toast.error(res.error)
      return
    }
    toast.success('Access revoked.')
    setScopes((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleAssign} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="assign-user">Manager</Label>
          <select
            id="assign-user"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="border-input focus-visible:ring-ring rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1"
            disabled={loading}
          >
            <option value="">Select manager…</option>
            {managers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name || m.email}
              </option>
            ))}
          </select>
          {userError && <p className="text-destructive text-xs">{userError}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Groups</Label>
          <GroupSelector groups={groups} selected={selectedGroupIds} onChange={setSelectedGroupIds} />
          {groupError && <p className="text-destructive text-xs">{groupError}</p>}
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={canViewAnalytics}
            onChange={(e) => setCanViewAnalytics(e.target.checked)}
            className="accent-primary"
          />
          Can view analytics
        </label>

        <Button type="submit" disabled={loading}>
          {loading ? 'Assigning…' : 'Assign Access'}
        </Button>
      </form>

      {scopes.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold">Current Access Scopes</h4>
          <ul className="flex flex-col gap-1">
            {scopes.map((scope) => {
              const manager = managers.find((m) => m.id === scope.userId)
              return (
                <li
                  key={scope.id}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
                >
                  <span>{manager?.name || manager?.email || scope.userId}</span>
                  <span className="text-xs text-textcolor-secondary">{scope.groupIds.length} groups</span>
                  <Button
                    size="small"
                    variant="ghost"
                    className="text-destructive hover:text-destructive h-7"
                    onClick={() => handleRevoke(scope.id)}
                  >
                    Revoke
                  </Button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
