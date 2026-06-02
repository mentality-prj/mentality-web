'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

import { GroupSelector } from '@/components/features/Company/GroupSelector'
import { useAuth } from '@/context/AuthProvider'
import {
  adminCreateAccessScope,
  adminDeleteAccessScope,
  adminGetAccessScopes,
  adminGetEmployees,
  adminGetGroups,
} from '@/requests/companyAdmin'
import { CustomSession } from '@/types/auth'
import { AccessScopeEntity, EmployeeEntity, GroupEntity } from '@/types/company'
import { COMPANY_ROLES } from '@/types/rbac'
import { Button } from '@/ui/button'
import { Checkbox } from '@/ui/checkbox'
import { Label } from '@/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

type Props = {
  companyId: string
}

export function AdminAssignManagerForm({ companyId }: Props) {
  const { session: data, status } = useAuth()
  const t = useTranslations('pages.Company.companyAdmin.assignManager')

  const [managers, setManagers] = useState<EmployeeEntity[]>([])
  const [groups, setGroups] = useState<GroupEntity[]>([])
  const [scopes, setScopes] = useState<AccessScopeEntity[]>([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])
  const [canViewAnalytics, setCanViewAnalytics] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userError, setUserError] = useState<string | null>(null)
  const [groupError, setGroupError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    const session = data as CustomSession

    const fetchAllManagers = async (): Promise<EmployeeEntity[] | null> => {
      const pageSize = 200
      let page = 1
      const allManagers: EmployeeEntity[] = []
      while (true) {
        const res = await adminGetEmployees(session, companyId, page, pageSize)
        if ('error' in res) return null
        const items = res.data.items
        allManagers.push(...items.filter((e) => e.role === COMPANY_ROLES.MANAGER))
        if (items.length < pageSize) break
        page += 1
      }
      return allManagers
    }

    const [managersResult, groupsRes, scopesRes] = await Promise.all([
      fetchAllManagers(),
      adminGetGroups(session, companyId),
      adminGetAccessScopes(session, companyId),
    ])

    if (managersResult) setManagers(managersResult)
    if (!('error' in groupsRes)) setGroups(groupsRes.data)
    if (!('error' in scopesRes)) setScopes(scopesRes.data)
  }, [data, companyId])

  useEffect(() => {
    if (status === 'authenticated') loadData()
    else if (status === 'unauthenticated') {
      setManagers([])
      setGroups([])
      setScopes([])
    }
  }, [loadData, status])

  function validate(): boolean {
    let valid = true
    if (!selectedUserId) {
      setUserError(t('errorUser'))
      valid = false
    } else setUserError(null)
    if (selectedGroupIds.length === 0) {
      setGroupError(t('errorGroups'))
      valid = false
    } else setGroupError(null)
    return valid
  }

  function getScopeGroupLabel(groupId: string): string {
    return groups.find((group) => group.id === groupId)?.name || groupId
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    if (!canViewAnalytics) return

    setLoading(true)
    const results = await Promise.all(
      selectedGroupIds.map((groupId) =>
        adminCreateAccessScope(data as CustomSession, companyId, {
          userId: selectedUserId,
          groupId,
          permission: 'VIEW_ANALYTICS',
        })
      )
    )
    setLoading(false)
    const errors = results.filter((result): result is { error: string } => 'error' in result)
    const createdScopes = results.filter((result): result is { data: AccessScopeEntity } => 'data' in result)

    if (createdScopes.length > 0) {
      toast.success(t('success'))
      setScopes((prev) => [...prev, ...createdScopes.map((result) => result.data)])
      setSelectedUserId('')
      setSelectedGroupIds([])
      setCanViewAnalytics(false)
    }

    if (errors.length > 0) {
      toast.error(errors[0].error)
    }
  }

  async function handleRevoke(id: string) {
    const res = await adminDeleteAccessScope(data as CustomSession, companyId, id)
    if ('error' in res) {
      toast.error(res.error)
      return
    }
    toast.success(t('revoked'))
    setScopes((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="flex flex-col gap-sm">
      <form onSubmit={handleAssign} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="admin-assign-user">{t('managerLabel')}</Label>
          <Select value={selectedUserId} onValueChange={setSelectedUserId} disabled={loading || managers.length === 0}>
            <SelectTrigger id="admin-assign-user">
              <SelectValue placeholder={managers.length === 0 ? t('managerEmpty') : t('managerPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {managers.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name || m.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {userError && <p className="text-destructive text-xs">{userError}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>{t('groupsLabel')}</Label>
          <GroupSelector groups={groups} selected={selectedGroupIds} onChange={setSelectedGroupIds} />
          {groupError && <p className="text-destructive text-xs">{groupError}</p>}
        </div>

        <label className="flex cursor-pointer items-center gap-xs">
          <Checkbox
            checked={canViewAnalytics}
            onCheckedChange={(v) => setCanViewAnalytics(v === true)}
            disabled={loading}
          />
          <span className="text-sm font-normal">{t('analyticsToggle')}</span>
        </label>

        <Button type="submit" disabled={loading || !canViewAnalytics}>
          {loading ? t('submitting') : t('submitButton')}
        </Button>
      </form>

      {scopes.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">{t('currentScopes')}</p>
          <ul className="flex flex-col gap-1.5">
            {scopes.map((scope) => {
              const manager = managers.find((m) => m.id === scope.userId)
              return (
                <li
                  key={scope.id}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
                >
                  <span>{manager ? manager.name || manager.email : scope.userId}</span>
                  <span className="text-xs text-textcolor-secondary">{getScopeGroupLabel(scope.groupId)}</span>
                  <Button
                    size="small"
                    variant="ghost"
                    className="text-destructive hover:text-destructive h-7 px-2 text-xs"
                    onClick={() => handleRevoke(scope.id)}
                  >
                    {t('revokeButton')}
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
