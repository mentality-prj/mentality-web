import { MOOD_STORY_ENDPOINTS } from '@/constants/endpoints'
import { MoodStoryEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'

import { APIUrl } from './config'
import { performAdminRequest, performAuthRequest } from './genericFetch'

export async function getLatestMoodStory(
  session: CustomSession | null
): Promise<{ data: MoodStoryEntity } | { error: string; status?: number }> {
  const res = await performAuthRequest<MoodStoryEntity>(session, `${APIUrl}${MOOD_STORY_ENDPOINTS.LATEST}`, {
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

export async function getTodayMoodStory(
  session: CustomSession | null,
  timeZone: string
): Promise<{ data: MoodStoryEntity } | { error: string; status?: number }> {
  const url = `${APIUrl}/mood-story/today?timeZone=${encodeURIComponent(timeZone)}`
  const res = await performAuthRequest<MoodStoryEntity>(session, url, { method: 'GET' })
  if ('error' in res) return { error: res.error, status: res.status }
  if (res.data == null) return { error: 'Today mood story is not ready' }
  return { data: res.data }
}

export async function regenerateMoodStory(
  session: CustomSession | null
): Promise<{ data: MoodStoryEntity } | { error: string }> {
  const res = await performAdminRequest<MoodStoryEntity>(session, `${APIUrl}${MOOD_STORY_ENDPOINTS.REGENERATE}`, {
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
