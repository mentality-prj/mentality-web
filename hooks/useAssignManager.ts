'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthProvider'
import { useTranslations } from 'next-intl'

import { useAdminCompany } from '@/context/adminCompanyContext'
import { useGroups } from '@/hooks/useGroups'
import {
  createAccessScope,
  createAccessScopeAdmin,
  deleteAccessScope,
  deleteAccessScopeAdmin,
  getAccessScopes,
  getAccessScopesAdmin,
} from '@/requests/accessScopes'
import { getEmployeesByRole, getEmployeesByRoleAdmin } from '@/requests/employees'
import { CustomSession } from '@/types/auth'
import { AccessScopeEntity, EmployeeEntity } from '@/types/company'
import { COMPANY_ROLES } from '@/types/rbac'

export function useAssignManager() {
  const t = useTranslations('pages.Company.companyAdmin.assignManager')
  const { session: data, status } = useAuth()
  const { companyId: adminCompanyId } = useAdminCompany()
  const { items: groups, companyId } = useGroups()

  const [managers, setManagers] = useState<EmployeeEntity[]>([])
  const [scopes, setScopes] = useState<AccessScopeEntity[]>([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])
  const [canViewAnalytics, setCanViewAnalytics] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userError, setUserError] = useState<string | null>(null)
  const [groupError, setGroupError] = useState<string | null>(null)

  useEffect(() => {
    setSelectedUserId('')
    setSelectedGroupIds([])
    setCanViewAnalytics(false)
    setUserError(null)
    setGroupError(null)
  }, [adminCompanyId])

  const loadManagersAndScopes = useCallback(async () => {
    if (!adminCompanyId && !companyId) return
    const session = data as CustomSession
    const [managersRes, scopesRes] = adminCompanyId
      ? await Promise.all([
          getEmployeesByRoleAdmin(session, adminCompanyId, COMPANY_ROLES.MANAGER),
          getAccessScopesAdmin(session, adminCompanyId),
        ])
      : await Promise.all([
          getEmployeesByRole(session, companyId!, COMPANY_ROLES.MANAGER),
          getAccessScopes(session, companyId!),
        ])
    if (!('error' in managersRes)) {
      setManagers(managersRes.data)
    }
    if (!('error' in scopesRes)) {
      setScopes(scopesRes.data)
    }
  }, [data, adminCompanyId, companyId])

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
      setUserError(t('errorUser'))
      valid = false
    } else setUserError(null)
    if (selectedGroupIds.length === 0) {
      setGroupError(t('errorGroups'))
      valid = false
    } else setGroupError(null)
    return valid
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    if (!adminCompanyId && !companyId) return
    if (!canViewAnalytics) return

    setLoading(true)
    const session = data as CustomSession
    const outcomes = await Promise.all(
      selectedGroupIds.map(async (groupId) => {
        const dto = { userId: selectedUserId, groupId, permission: 'VIEW_ANALYTICS' as const }
        const result = adminCompanyId
          ? await createAccessScopeAdmin(session, adminCompanyId, dto)
          : await createAccessScope(session, companyId!, dto)

        return { groupId, result }
      })
    )
    setLoading(false)
    const errors = outcomes.filter(
      (item): item is { groupId: string; result: { error: string } } => 'error' in item.result
    )
    const createdScopes = outcomes.filter(
      (item): item is { groupId: string; result: { data: AccessScopeEntity } } => 'data' in item.result
    )
    const remainingGroupIds = errors.map((item) => item.groupId)

    if (createdScopes.length > 0) {
      toast.success(t('success'))
      setScopes((prev) => [...prev, ...createdScopes.map((item) => item.result.data)])
    }

    if (errors.length > 0) {
      toast.error(errors[0].result.error)
    }

    if (errors.length === 0) {
      setSelectedUserId('')
      setSelectedGroupIds([])
      setCanViewAnalytics(false)
      return
    }

    setSelectedGroupIds(remainingGroupIds)
  }

  async function handleRevoke(id: string) {
    if (!adminCompanyId && !companyId) return
    const session = data as CustomSession
    const res = adminCompanyId
      ? await deleteAccessScopeAdmin(session, adminCompanyId, id)
      : await deleteAccessScope(session, companyId!, id)
    if ('error' in res) {
      toast.error(res.error)
      return
    }
    toast.success(t('revoked'))
    setScopes((prev) => prev.filter((s) => s.id !== id))
  }

  const isReady = Boolean(adminCompanyId || companyId)

  return {
    groups,
    managers,
    scopes,
    selectedUserId,
    setSelectedUserId,
    selectedGroupIds,
    setSelectedGroupIds,
    canViewAnalytics,
    setCanViewAnalytics,
    loading,
    isReady,
    userError,
    groupError,
    handleAssign,
    handleRevoke,
  }
}
