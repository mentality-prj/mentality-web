import { logger } from '@/lib/logger'
import { CreateDiaryDto, DiaryEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'

import { APIUrl } from './config'
import { performAuthRequest } from './genericFetch'

export async function createDiary(session: CustomSession | null, dto: CreateDiaryDto) {
  const res = await performAuthRequest<DiaryEntity>(session, `${APIUrl}/diary`, { method: 'POST', body: dto })
  if ('error' in res) {
    logger.error('Failed to create diary', { error: res.error })
    return { error: res.error }
  }
  return { data: res.data }
}

export async function getUserDiaries(session: CustomSession | null) {
  const res = await performAuthRequest<DiaryEntity[]>(session, `${APIUrl}/diary/user`, { method: 'GET' })
  if ('error' in res) {
    logger.error('Failed to get user diaries', { error: res.error })
    return { error: res.error }
  }
  return { data: res.data }
}

/** Read-only user-local diary activity; no private entry text is transmitted. */
export async function getTodayDiaryStatus(session: CustomSession | null, timeZone: string) {
  const url = `${APIUrl}/diary/today-status?timeZone=${encodeURIComponent(timeZone)}`
  const res = await performAuthRequest<{ hasEntry: boolean }>(session, url, { method: 'GET' })
  if ('error' in res) {
    logger.warn('Failed to load private daily diary status', { error: res.error })
    return { error: res.error }
  }
  return { data: res.data }
}

export async function getDiaryById(session: CustomSession | null, id: string) {
  const res = await performAuthRequest<DiaryEntity>(session, `${APIUrl}/diary/${id}`, { method: 'GET' })
  if ('error' in res) return { error: res.error }
  return { data: res.data }
}

export async function activateDiary(session: CustomSession | null, id: string) {
  const res = await performAuthRequest<DiaryEntity>(session, `${APIUrl}/diary/${id}/activate`, { method: 'PATCH' })
  if ('error' in res) return { error: res.error }
  return { data: res.data }
}

export async function deleteDiary(session: CustomSession | null, id: string) {
  const res = await performAuthRequest<void>(session, `${APIUrl}/diary/${encodeURIComponent(id)}`, { method: 'DELETE' })
  if ('error' in res) return { error: res.error }
  return { data: true }
}

