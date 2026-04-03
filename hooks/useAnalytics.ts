'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { ONE_YEAR_MS } from '@/constants/company'
import { useAdminCompany } from '@/context/adminCompanyContext'
import { oneYearAgoStr,todayStr } from '@/helpers/company.helpers'
import { useGroups } from '@/hooks/useGroups'
import { APIUrl } from '@/requests/config'
import { performAdminRequest, performAuthRequest } from '@/requests/genericFetch'
import { CustomSession } from '@/types/auth'

type AnalyticsBucket = {
  label: string
  value: number
}

export function useAnalytics() {
  const t = useTranslations('pages.Company.manager.analytics')
  const { data, status } = useSession()
  const { companyId: adminCompanyId } = useAdminCompany()
  const { items: groups } = useGroups(true)

  const [groupIds, setGroupIds] = useState<string[]>([])
  const [from, setFrom] = useState(oneYearAgoStr())
  const [to, setTo] = useState(todayStr())
  const [chartData, setChartData] = useState<AnalyticsBucket[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dateError, setDateError] = useState<string | null>(null)

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
    const params = new URLSearchParams({ from, to })
    if (groupIds.length) params.set('groupIds', groupIds.join(','))
    const url = adminCompanyId
      ? `${APIUrl}/companies/${adminCompanyId}/analytics/mood?${params}`
      : `${APIUrl}/analytics/mood?${params}`
    const res = adminCompanyId
      ? await performAdminRequest<AnalyticsBucket[]>(session, url)
      : await performAuthRequest<AnalyticsBucket[]>(session, url)
    if ('error' in res) {
      setError(res.error)
    } else {
      setChartData(Array.isArray(res.data) ? res.data : [])
    }
    setLoading(false)
  }, [data, from, to, groupIds, validateDates, adminCompanyId])

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
    chartData,
    loading,
    error,
    dateError,
    fetchAnalytics,
    todayStr,
  }
}
