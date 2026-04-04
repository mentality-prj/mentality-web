'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
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
  const { data, status } = useSession()
  const { companyId: adminCompanyId } = useAdminCompany()
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
    const [managersRes, scopesRes] = adminCompanyId
      ? await Promise.all([
          getEmployeesByRoleAdmin(session, adminCompanyId, COMPANY_ROLES.MANAGER),
          getAccessScopesAdmin(session, adminCompanyId),
        ])
      : await Promise.all([getEmployeesByRole(session, COMPANY_ROLES.MANAGER), getAccessScopes(session)])
    if (!('error' in managersRes)) {
      setManagers(managersRes.data)
    }
    if (!('error' in scopesRes)) {
      setScopes(scopesRes.data)
    }
  }, [data, adminCompanyId])

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
    setLoading(true)
    const dto = { userId: selectedUserId, groupIds: selectedGroupIds, canViewAnalytics }
    const session = data as CustomSession
    const res = adminCompanyId
      ? await createAccessScopeAdmin(session, adminCompanyId, dto)
      : await createAccessScope(session, dto)
    setLoading(false)
    if ('error' in res) {
      toast.error(res.error)
      return
    }
    toast.success(t('success'))
    setScopes((prev) => [...prev, res.data])
    setSelectedUserId('')
    setSelectedGroupIds([])
    setCanViewAnalytics(false)
  }

  async function handleRevoke(id: string) {
    const session = data as CustomSession
    const res = adminCompanyId
      ? await deleteAccessScopeAdmin(session, adminCompanyId, id)
      : await deleteAccessScope(session, id)
    if ('error' in res) {
      toast.error(res.error)
      return
    }
    toast.success(t('revoked'))
    setScopes((prev) => prev.filter((s) => s.id !== id))
  }

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
    userError,
    groupError,
    handleAssign,
    handleRevoke,
  }
}
