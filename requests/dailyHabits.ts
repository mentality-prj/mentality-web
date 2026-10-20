import { CustomSession } from '@/types/auth'
import { isValidTimeZone } from '@/utils/timeZone'

import { APIUrl } from './config'
import { type ApiResponseDecoder, performAuthRequest } from './genericFetch'

export const DAILY_HABIT_KINDS = ['breathing', 'movement', 'journaling', 'screenBreak'] as const
export type DailyHabitKind = (typeof DAILY_HABIT_KINDS)[number]
export type DailyHabitToday = { kind: DailyHabitKind; doneToday: boolean }

const API_PATH = `${APIUrl}/daily-habits`

function allowedKind(value: unknown): value is DailyHabitKind {
  return typeof value === 'string' && DAILY_HABIT_KINDS.some((kind) => kind === value)
}

function decodeHabit(value: unknown): DailyHabitToday | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const data = value as Record<string, unknown>
  if (!allowedKind(data.kind) || typeof data.doneToday !== 'boolean') return null
  return { kind: data.kind, doneToday: data.doneToday }
}

const decodeList: ApiResponseDecoder<DailyHabitToday[]> = (value) => {
  if (!Array.isArray(value) || value.length > DAILY_HABIT_KINDS.length) return { success: false }
  const entries: DailyHabitToday[] = []
  for (const valueEntry of value) {
    const parsed = decodeHabit(valueEntry)
    if (!parsed || entries.some((item) => item.kind === parsed.kind)) return { success: false }
    entries.push(parsed)
  }
  return { success: true, data: entries }
}

function validateZone(timeZone: string | null): string | null {
  return isValidTimeZone(timeZone) ? encodeURIComponent(timeZone) : null
}

export async function getDailyHabits(session: CustomSession | null, timeZone: string | null) {
  const zone = validateZone(timeZone)
  if (!zone) return { error: 'Valid local timezone required' }
  return performAuthRequest(session, `${API_PATH}?timeZone=${zone}`, {
    method: 'GET',
    decodeResponse: decodeList,
  })
}

export async function chooseDailyHabit(session: CustomSession | null, kind: DailyHabitKind, timeZone: ...[truncated]