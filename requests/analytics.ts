import { logger } from '@/lib/logger'
import { CustomSession } from '@/types/auth'
import { AnalyticsPreferences, AnalyticsResponse, UpdateAnalyticsPreferencesDto } from '@/types/company'

import { APIUrl } from './config'
import { performAdminRequest, performAuthRequest } from './genericFetch'

export type MoodAnalyticsParams = {
  from: string
  to: string
  groupIds?: string[]
}

const ANALYTICS_PREFERENCES_URL = `${APIUrl}/auth/me/analytics-preferences`

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

export async function getAnalyticsPreferences(
  session: CustomSession | null
): Promise<{ data: AnalyticsPreferences } | { error: string; status?: number }> {
  const res = await performAuthRequest<AnalyticsPreferences>(session, ANALYTICS_PREFERENCES_URL, { method: 'GET' })

  if ('error' in res) {
    logger.error('Failed to fetch analytics preferences', { error: res.error })
    return { error: res.error, status: res.status }
  }

  return { data: res.data as AnalyticsPreferences }
}

export async function updateAnalyticsPreferences(
  session: CustomSession | null,
  dto: UpdateAnalyticsPreferencesDto
): Promise<{ data: AnalyticsPreferences } | { error: string; status?: number }> {
  const res = await performAuthRequest<AnalyticsPreferences>(session, ANALYTICS_PREFERENCES_URL, {
    method: 'PATCH',
    body: dto,
  })

  if ('error' in res) {
    logger.error('Failed to update analytics preferences', { error: res.error, sprintAnchorDay: dto.sprintAnchorDay })
    return { error: res.error, status: res.status }
  }

  return { data: res.data as AnalyticsPreferences }
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
