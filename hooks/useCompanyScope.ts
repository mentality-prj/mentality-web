'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useAdminCompany } from '@/context/adminCompanyContext'
import { useAuth } from '@/context/AuthProvider'
import { getMyCompany } from '@/requests/companies'
import { CustomSession } from '@/types/auth'
import { Roles } from '@/types/security'

type UseCompanyScopeResult = {
  session: CustomSession | null
  status: ReturnType<typeof useAuth>['status']
  companyId: string | null
  companyScopeError: string | null
  isSystemAdmin: boolean
  resolveCompanyId: () => Promise<string | null>
}

export function useCompanyScope(): UseCompanyScopeResult {
  const { session: data, status } = useAuth()
  const { companyId: adminCompanyId } = useAdminCompany()
  const [resolvedCompanyId, setResolvedCompanyId] = useState<string | null>(null)
  const [companyScopeError, setCompanyScopeError] = useState<string | null>(null)
  const resolvedCompanyIdRef = useRef<string | null>(null)
  const isSystemAdmin = data?.user?.role === Roles.ADMIN

  useEffect(() => {
    if (isSystemAdmin) {
      resolvedCompanyIdRef.current = adminCompanyId ?? null
      setResolvedCompanyId(adminCompanyId ?? null)
      setCompanyScopeError(null)
      return
    }

    resolvedCompanyIdRef.current = null
    setResolvedCompanyId(null)
    setCompanyScopeError(null)
  }, [adminCompanyId, isSystemAdmin])

  useEffect(() => {
    if (status === 'unauthenticated') {
      resolvedCompanyIdRef.current = null
      setResolvedCompanyId(null)
      setCompanyScopeError(null)
    }
  }, [status])

  const resolveCompanyId = useCallback(async (): Promise<string | null> => {
    if (status !== 'authenticated') {
      return null
    }

    if (isSystemAdmin) {
      const nextCompanyId = adminCompanyId ?? null
      resolvedCompanyIdRef.current = nextCompanyId
      setResolvedCompanyId(nextCompanyId)
      setCompanyScopeError(null)
      return nextCompanyId
    }

    if (resolvedCompanyIdRef.current) {
      setCompanyScopeError(null)
      return resolvedCompanyIdRef.current
    }

    if (!data) {
      setCompanyScopeError('Session is unavailable')
      return null
    }

    const session = data as CustomSession
    const result = await getMyCompany(session)

    if ('error' in result) {
      setCompanyScopeError(result.error)
      return null
    }

    resolvedCompanyIdRef.current = result.data.id
    setResolvedCompanyId(result.data.id)
    setCompanyScopeError(null)
    return result.data.id
  }, [adminCompanyId, data, isSystemAdmin, status])

  return {
    session: (data as CustomSession | null) ?? null,
    status,
    companyId: adminCompanyId ?? resolvedCompanyId,
    companyScopeError,
    isSystemAdmin,
    resolveCompanyId,
  }
}
