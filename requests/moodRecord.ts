import { MOOD_RECORD_ENDPOINTS } from '@/constants/endpoints'
import { logger } from '@/lib/logger'
import { CreateMoodRecordDto, MoodRecordEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'

import { extractPaginationTotal } from '../lib/http'

import { APIUrl } from './config'
import { performAuthRequest } from './genericFetch'

export async function createMoodRecord(session: CustomSession | null, dto: CreateMoodRecordDto) {
  const res = await performAuthRequest<MoodRecordEntity>(session, `${APIUrl}${MOOD_RECORD_ENDPOINTS.BASE}`, {
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
  params?: {
    page?: number
    limit?: number
    moodMin?: number
    moodMax?: number
    stressMin?: number
    stressMax?: number
    energyMin?: number
    energyMax?: number
    focusMin?: number
    focusMax?: number
    tags?: string[]
    weekdays?: number[]
  }
) {
  const query = new URLSearchParams()

  if (!params) params = {}

  if (typeof params?.page === 'number') query.set('page', String(params.page))
  if (typeof params?.limit === 'number') query.set('limit', String(params.limit))

  const ranges = [
    ['moodMin', 'moodMax'],
    ['stressMin', 'stressMax'],
    ['energyMin', 'energyMax'],
    ['focusMin', 'focusMax'],
  ] as const

  ranges.forEach(([minKey, maxKey]) => {
    if (typeof params![`${minKey}`] === 'number') query.set(minKey, String(params![`${minKey}`]))
    if (typeof params![`${maxKey}`] === 'number') query.set(maxKey, String(params![`${maxKey}`]))
  })

  params.tags?.forEach((tag) => query.append('tags', tag))
  params.weekdays?.forEach((day) => query.append('weekdays', String(day)))

  const url = `${APIUrl}${MOOD_RECORD_ENDPOINTS.BASE}${query.toString() ? `?${query.toString()}` : ''}`
  const res = await performAuthRequest<MoodRecordEntity[]>(session, url, { method: 'GET' })
  if ('error' in res) return { error: res.error }
  const moodNotes: MoodRecordEntity[] = Array.isArray(res.data) ? res.data : []
  const total = extractPaginationTotal(res.headers, moodNotes.length)
  return { data: { moodNotes, total } }
}

export async function getLastMoodRecords(session: CustomSession | null, params?: { limit?: number; days?: number }) {
  const query = new URLSearchParams()
  // If days is provided (>0) use it; otherwise fall back to limit for backward compatibility
  if (typeof params?.days === 'number' && params.days > 0) query.set('days', String(params.days))
  else if (typeof params?.limit === 'number') query.set('limit', String(params.limit))
  const url = `${APIUrl}${MOOD_RECORD_ENDPOINTS.LAST}${query.toString() ? `?${query.toString()}` : ''}`
  const res = await performAuthRequest<MoodRecordEntity[]>(session, url, { method: 'GET' })
  if ('error' in res) return { error: res.error }
  return { data: res.data }
}

export async function getMoodRecordById(session: CustomSession | null, id: string) {
  const res = await performAuthRequest<MoodRecordEntity>(session, `${APIUrl}${MOOD_RECORD_ENDPOINTS.byId(id)}`, {
    method: 'GET',
  })
  if ('error' in res) return { error: res.error }
  return { data: res.data }
}
