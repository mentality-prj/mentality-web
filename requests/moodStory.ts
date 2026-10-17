import { MOOD_STORY_ENDPOINTS } from '@/constants/endpoints'
import { MoodStoryEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'

import { APIUrl } from './config'
import { performAdminRequest, performAuthRequest } from './genericFetch'

type MoodStoryResponse = { data: MoodStoryEntity } | { error: string; status?: number }

async function fetchMoodStory(session: CustomSession | null, endpoint: string, timeZone?: string | null): Promise<MoodStoryResponse> {
  const query = timeZone ? `?timeZone=${encodeURIComponent(timeZone)}` : ''
  const res = await performAuthRequest<MoodStoryEntity>(session, `${APIUrl}${endpoint}${query}`, {
    method: 'GET',
  })
  if ('error' in res) {
    return res.status !== undefined ? { error: res.error, status: res.status } : { error: res.error }
  }
  if (res.data == null) {
    return { error: 'No mood story returned from server' }
  }
  return { data: res.data }
}

export function getLatestMoodStory(session: CustomSession | null): Promise<MoodStoryResponse> {
  return fetchMoodStory(session, MOOD_STORY_ENDPOINTS.LATEST)
}

export function getTodayMoodStory(session: CustomSession | null, timeZone?: string | null): Promise<MoodStoryResponse> {
  return fetchMoodStory(session, MOOD_STORY_ENDPOINTS.TODAY, timeZone)
}

export async function regenerateMoodStory(
  session: CustomSession | null,
  timeZone?: string | null
): Promise<{ data: MoodStoryEntity } | { error: string }> {
  const query = timeZone ? `?timeZone=${encodeURIComponent(timeZone)}` : ''
  const res = await performAdminRequest<MoodStoryEntity>(session, `${APIUrl}${MOOD_STORY_ENDPOINTS.REGENERATE}${query}`, {
    method: 'POST',
  })
  if ('error' in res) {
    return { error: res.error }
  }
  if (res.data == null) {
    return { error: 'No mood story returned from server' }
  }
  return { data: res.data }
}
