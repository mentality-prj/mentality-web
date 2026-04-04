'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { ONE_YEAR_MS } from '@/constants/company'
import { useAdminCompany } from '@/context/adminCompanyContext'
import { oneYearAgoStr, todayStr } from '@/helpers/company.helpers'
import { useGroups } from '@/hooks/useGroups'
import { getMoodAnalytics, getMoodAnalyticsAdmin } from '@/requests/analytics'
import { getMyCompany } from '@/requests/companies'
import { CustomSession } from '@/types/auth'
import { AnalyticsResponse } from '@/types/company'

export function useAnalytics() {
  const t = useTranslations('pages.Company.manager.analytics')
  const { data, status } = useSession()
  const { companyId: adminCompanyId } = useAdminCompany()
  const [resolvedCompanyId, setResolvedCompanyId] = useState<string | null>(null)
  const { items: groups } = useGroups(resolvedCompanyId ?? undefined)

  const [groupIds, setGroupIds] = useState<string[]>([])

  const [from, setFrom] = useState(oneYearAgoStr())
  const [to, setTo] = useState(todayStr())
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dateError, setDateError] = useState<string | null>(null)

  useEffect(() => {
    setResolvedCompanyId(null)
    setGroupIds([])
    setAnalytics(null)
    setError(null)
    setDateError(null)
  }, [adminCompanyId])

  const validateDates = useCallback((): boolean => {
    const fromDate = new Date(from)
    const toDate = new Date(to)
    if (toDate <= fromDate) {
      setDateError(t('errorDateOrder'))
      return false
    }
    if (toDate.getTime() - fromDate.getTime() > ONE_YEAR_MS) {
      setDateError(t('errorDateRange'))
      return false
    }
    setDateError(null)
    return true
  }, [from, t, to])

  const fetchAnalytics = useCallback(async () => {
    if (!validateDates()) return
    setLoading(true)
    setError(null)
    const session = data as CustomSession
    const analyticsParams = { from, to, groupIds: groupIds.length ? groupIds : undefined }

    let companyId = adminCompanyId ?? resolvedCompanyId
    if (!companyId) {
      const myCompanyRes = await getMyCompany(session)
      if ('error' in myCompanyRes) {
        setError(myCompanyRes.error)
        setLoading(false)
        return
      }
      companyId = myCompanyRes.data.id
      setResolvedCompanyId(companyId)
    }

    const res = adminCompanyId
      ? await getMoodAnalyticsAdmin(session, companyId, analyticsParams)
      : await getMoodAnalytics(session, companyId, analyticsParams)

    if ('error' in res) {
      setError(res.error)
    } else {
      setAnalytics(res.data)
    }
    setLoading(false)
  }, [data, from, to, groupIds, validateDates, adminCompanyId, resolvedCompanyId])

  useEffect(() => {
    if (status === 'authenticated') fetchAnalytics()
  }, [status, fetchAnalytics])

  return {
    groups,
    groupIds,
    setGroupIds,
    from,
    setFrom,
    to,
    setTo,
    analytics,
    loading,
    error,
    dateError,
    todayStr,
  }
}
