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
  isSystemAdmin: boolean
  resolveCompanyId: () => Promise<string | null>
}

export function useCompanyScope(): UseCompanyScopeResult {
  const { session: data, status } = useAuth()
  const { companyId: adminCompanyId } = useAdminCompany()
  const [resolvedCompanyId, setResolvedCompanyId] = useState<string | null>(null)
  const resolvedCompanyIdRef = useRef<string | null>(null)
  const isSystemAdmin = data?.user?.role === Roles.ADMIN

  useEffect(() => {
    if (isSystemAdmin) {
      resolvedCompanyIdRef.current = adminCompanyId ?? null
      setResolvedCompanyId(adminCompanyId ?? null)
      return
    }

    resolvedCompanyIdRef.current = null
    setResolvedCompanyId(null)
  }, [adminCompanyId, isSystemAdmin])

  useEffect(() => {
    if (status === 'unauthenticated') {
      resolvedCompanyIdRef.current = null
      setResolvedCompanyId(null)
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
      return nextCompanyId
    }

    if (resolvedCompanyIdRef.current) {
      return resolvedCompanyIdRef.current
    }

    const session = data as CustomSession
    const result = await getMyCompany(session)

    if ('error' in result) {
      return null
    }

    resolvedCompanyIdRef.current = result.data.id
    setResolvedCompanyId(result.data.id)
    return result.data.id
  }, [adminCompanyId, data, isSystemAdmin, status])

  return {
    session: (data as CustomSession | null) ?? null,
    status,
    companyId: adminCompanyId ?? resolvedCompanyId,
    isSystemAdmin,
    resolveCompanyId,
  }
}
