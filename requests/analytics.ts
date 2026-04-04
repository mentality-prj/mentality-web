import { logger } from '@/lib/logger'
import { CustomSession } from '@/types/auth'
import { AnalyticsResponse } from '@/types/company'

import { APIUrl } from './config'
import { performAdminRequest, performAuthRequest } from './genericFetch'

export type MoodAnalyticsParams = {
  from: string
  to: string
  groupIds?: string[]
}

export async function getMoodAnalytics(
  session: CustomSession | null,
  companyId: string,
  params: MoodAnalyticsParams
): Promise<{ data: AnalyticsResponse } | { error: string }> {
  const searchParams = new URLSearchParams({ from: params.from, to: params.to })
  if (params.groupIds?.length) searchParams.set('groupIds', params.groupIds.join(','))

  const url = `${APIUrl}/companies/${companyId}/analytics/mood?${searchParams}`
  const res = await performAuthRequest<AnalyticsResponse>(session, url)

  if ('error' in res) {
    logger.error('Failed to fetch mood analytics', { error: res.error, companyId })
    return { error: res.error }
  }

  return { data: res.data as AnalyticsResponse }
}

export async function getMoodAnalyticsAdmin(
  session: CustomSession | null,
  companyId: string,
  params: MoodAnalyticsParams
): Promise<{ data: AnalyticsResponse } | { error: string }> {
  const searchParams = new URLSearchParams({ from: params.from, to: params.to })
  if (params.groupIds?.length) searchParams.set('groupIds', params.groupIds.join(','))

  const url = `${APIUrl}/companies/${companyId}/analytics/mood?${searchParams}`
  const res = await performAdminRequest<AnalyticsResponse>(session, url)

  if ('error' in res) {
    logger.error('Admin: failed to fetch mood analytics', { error: res.error, companyId })
    return { error: res.error }
  }

  return { data: res.data as AnalyticsResponse }
}
