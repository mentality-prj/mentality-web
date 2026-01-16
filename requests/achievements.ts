import { logger } from '@/lib/logger'
import { Achievements } from '@/types/achievements'
import { CustomSession } from '@/types/auth'

import { APIUrl } from './config'
import { performAuthRequest } from './genericFetch'

export async function getAchievements(session: CustomSession | null) {
  const url = `${APIUrl}/achievements`
  const res = await performAuthRequest<Achievements[]>(session, url, { method: 'GET' })
  if ('error' in res) {
    logger.error('Failed to get achievements', { error: res.error })
    return { error: res.error }
  }
  const items = Array.isArray(res.data) ? res.data : []
  return { data: items }
}
