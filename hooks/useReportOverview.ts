'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'

import { getReportOverviewVM } from '@/requests/reportingClient'
import { ReportOverviewVM } from '@/types/reporting'

import { useCompanyScope } from './useCompanyScope'

type UseReportOverviewResult = {
  overview: ReportOverviewVM | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useReportOverview(preferManagerScope = false): UseReportOverviewResult {
  const locale = useLocale()
  const { session, status, isSystemAdmin, resolveCompanyId, companyScopeError } = useCompanyScope()
  const [overview, setOverview] = useState<ReportOverviewVM | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestTokenRef = useRef(0)
  const useAdminMode = isSystemAdmin && !preferManagerScope

  const refresh = useCallback(async () => {
    if (status !== 'authenticated') return

    const token = ++requestTokenRef.current
    setLoading(true)
    setError(null)

    const companyId = await resolveCompanyId()
    if (!companyId) {
      if (requestTokenRef.current === token) {
        if (companyScopeError) {
          setError(companyScopeError)
        }
        setOverview(null)
        setLoading(false)
      }
      return
    }

    const result = await getReportOverviewVM({ session, companyId, admin: useAdminMode, locale })
    if (requestTokenRef.current !== token) return

    if ('error' in result) {
      setError(result.error)
      setOverview(null)
      setLoading(false)
      return
    }

    setOverview(result.data)
    setLoading(false)
  }, [companyScopeError, locale, resolveCompanyId, session, status, useAdminMode])

  useEffect(() => {
    if (status === 'authenticated') {
      refresh()
    } else if (status === 'unauthenticated') {
      requestTokenRef.current += 1
      setOverview(null)
      setError(null)
      setLoading(false)
    }
  }, [refresh, status])

  return { overview, loading, error, refresh }
}
