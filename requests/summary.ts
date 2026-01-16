import { logger } from '@/lib/logger'
import { CustomSession } from '@/types/auth'

import { APIUrl } from './config'
import { performAuthRequest } from './genericFetch'

export async function getTodayObservations(session: CustomSession | null) {
  const url = `${APIUrl}/summary/today-observations`
  const res = await performAuthRequest<string[]>(session, url, { method: 'GET' })
  if ('error' in res) {
    logger.error('Failed to get today observations', { error: res.error })
    return { error: res.error }
  }
  return { data: res.data ?? [] }
}

export async function getMoodMarks(session: CustomSession | null) {
  const url = `${APIUrl}/summary/mood-marks`
  const res = await performAuthRequest<Record<string, number>>(session, url, { method: 'GET' })
  if ('error' in res) {
    logger.error('Failed to get mood marks', { error: res.error })
    return { error: res.error }
  }
  return { data: res.data ?? {} }
}

export async function getStressLevel(session: CustomSession | null) {
  const url = `${APIUrl}/summary/stress-level`
  const res = await performAuthRequest<number>(session, url, { method: 'GET' })
  if ('error' in res) {
    logger.error('Failed to get stress level', { error: res.error })
    return { error: res.error }
  }
  return { data: typeof res.data === 'number' ? res.data : null }
}

export async function getBestDay(session: CustomSession | null) {
  const url = `${APIUrl}/summary/best-day`
  const res = await performAuthRequest<{ date: string; mood: string; stress: number }>(session, url, { method: 'GET' })
  if ('error' in res) {
    logger.error('Failed to get best day', { error: res.error })
    return { error: res.error }
  }
  return { data: res.data ?? null }
}

export async function getMoodCounts(session: CustomSession | null) {
  const url = `${APIUrl}/summary/mood-counts`
  const res = await performAuthRequest<{ mood: string; count: number }[]>(session, url, { method: 'GET' })
  if ('error' in res) {
    logger.error('Failed to get mood counts', { error: res.error })
    return { error: res.error }
  }

  return { data: res.data ?? [] }
}
