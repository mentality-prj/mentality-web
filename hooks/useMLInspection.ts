'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'

import { useAdminCompany } from '@/context/adminCompanyContext'
import { useAuth } from '@/context/AuthProvider'
import { getAdminDiagnosticsInspectionVM } from '@/requests/reportingClient'
import { MLInspectionVM } from '@/types/reporting'
import { Roles } from '@/types/security'

type UseMLInspectionResult = {
  targetId: string
  inspection: MLInspectionVM | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useMLInspection(): UseMLInspectionResult {
  const locale = useLocale()
  const { session: data, status } = useAuth()
  const { companyId } = useAdminCompany()
  const [inspection, setInspection] = useState<MLInspectionVM | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestTokenRef = useRef(0)

  const refresh = useCallback(async () => {
    if (status !== 'authenticated') return

    if (data?.user?.role !== Roles.ADMIN) {
      setInspection(null)
      setError(null)
      setLoading(false)
      return
    }

    if (!companyId) {
      setInspection(null)
      setError(null)
      setLoading(false)
      return
    }

    const token = ++requestTokenRef.current
    setLoading(true)
    setError(null)

    const result = await getAdminDiagnosticsInspectionVM(data, companyId, locale)

    if (requestTokenRef.current !== token) return

    if ('error' in result) {
      setInspection(null)
      setError(result.error)
      setLoading(false)
      return
    }

    setInspection(result.data)
    setLoading(false)
  }, [companyId, data, locale, status])

  useEffect(() => {
    if (status === 'authenticated') {
      refresh()
    } else if (status === 'unauthenticated') {
      requestTokenRef.current += 1
      setInspection(null)
      setError(null)
      setLoading(false)
    }
  }, [refresh, status])

  return {
    targetId: companyId ?? '',
    inspection,
    loading,
    error,
    refresh,
  }
}
