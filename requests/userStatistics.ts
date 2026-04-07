import { USER_STATISTICS_ENDPOINTS } from '@/constants/endpoints'
import { CustomSession } from '@/types/auth'
import { MoodStatistics, PsyTestsStatistics } from '@/types/userStatistics'

import { APIUrl } from './config'
import { performAuthRequest } from './genericFetch'

/** Fetches mood check-in statistics for the authenticated user. */
export async function getMoodStatistics(
  session: CustomSession | null
): Promise<{ data: MoodStatistics } | { error: string; status?: number }> {
  const res = await performAuthRequest<MoodStatistics>(session, `${APIUrl}${USER_STATISTICS_ENDPOINTS.MOOD}`, {
    method: 'GET',
  })
  if ('error' in res) {
    return res.status !== undefined ? { error: res.error, status: res.status } : { error: res.error }
  }
  if (res.data == null) {
    return { error: 'No mood statistics returned' }
  }
  return { data: res.data }
}

/** Fetches psychological test statistics (K-10, PHQ-9, GAD-7) for the authenticated user. */
export async function getPsyTestsStatistics(
  session: CustomSession | null
): Promise<{ data: PsyTestsStatistics } | { error: string; status?: number }> {
  const res = await performAuthRequest<PsyTestsStatistics>(session, `${APIUrl}${USER_STATISTICS_ENDPOINTS.PSYTESTS}`, {
    method: 'GET',
  })
  if ('error' in res) {
    return res.status !== undefined ? { error: res.error, status: res.status } : { error: res.error }
  }
  if (res.data == null) {
    return { error: 'No psytests statistics returned' }
  }
  return { data: res.data }
}
