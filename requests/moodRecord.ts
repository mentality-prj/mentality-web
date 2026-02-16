import { logger } from '@/lib/logger'
import { CreateMoodRecordDto, MoodRecordEntity, SetActiveDto, UpdateMoodRecordDto } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'

import { APIUrl } from './config'
import { performAuthRequest } from './genericFetch'

export async function createMoodRecord(session: CustomSession | null, dto: CreateMoodRecordDto) {
  const res = await performAuthRequest<MoodRecordEntity>(session, `${APIUrl}/mood-record`, {
    method: 'POST',
    body: dto,
  })
  if ('error' in res) {
    logger.error('Failed to create mood record', { error: res.error })
    return { error: res.error }
  }
  return { data: res.data }
}

export async function getMoodRecords(
  session: CustomSession | null,
  params?: { active?: boolean; page?: number; limit?: number }
) {
  const query = new URLSearchParams()
  if (typeof params?.active === 'boolean') query.set('active', String(params.active))
  if (typeof params?.page === 'number') query.set('page', String(params.page))
  if (typeof params?.limit === 'number') query.set('limit', String(params.limit))

  const url = `${APIUrl}/mood-record${query.toString() ? `?${query.toString()}` : ''}`
  const res = await performAuthRequest<MoodRecordEntity[]>(session, url, { method: 'GET' })
  if ('error' in res) return { error: res.error }
  return { data: res.data }
}

export async function getLastMoodRecords(
  session: CustomSession | null,
  params?: { limit?: number; active?: boolean; days?: number }
) {
  const query = new URLSearchParams()
  // If days is provided (>0) use it; otherwise fall back to limit for backward compatibility
  if (typeof params?.days === 'number' && params.days > 0) query.set('days', String(params.days))
  else if (typeof params?.limit === 'number') query.set('limit', String(params.limit))
  if (typeof params?.active === 'boolean') query.set('active', String(params.active))
  const url = `${APIUrl}/mood-record/last${query.toString() ? `?${query.toString()}` : ''}`
  const res = await performAuthRequest<MoodRecordEntity[]>(session, url, { method: 'GET' })
  if ('error' in res) return { error: res.error }
  return { data: res.data }
}

export async function getMoodRecordById(session: CustomSession | null, id: string) {
  const res = await performAuthRequest<MoodRecordEntity>(session, `${APIUrl}/mood-record/${id}`, { method: 'GET' })
  if ('error' in res) return { error: res.error }
  return { data: res.data }
}

export async function updateMoodRecord(session: CustomSession | null, id: string, dto: UpdateMoodRecordDto) {
  const res = await performAuthRequest<MoodRecordEntity>(session, `${APIUrl}/mood-record/${id}`, {
    method: 'PATCH',
    body: dto,
  })
  if ('error' in res) return { error: res.error }
  return { data: res.data }
}

export async function setMoodRecordActive(session: CustomSession | null, id: string, dto: SetActiveDto) {
  const res = await performAuthRequest<MoodRecordEntity>(session, `${APIUrl}/mood-record/${id}/active`, {
    method: 'PATCH',
    body: dto,
  })
  if ('error' in res) return { error: res.error }
  return { data: res.data }
}
