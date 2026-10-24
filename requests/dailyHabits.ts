import { CustomSession } from '@/types/auth'
import { isValidTimeZone } from '@/utils/timeZone'

import { APIUrl } from './config'
import { performAuthRequest } from './genericFetch'

export const DAILY_HABIT_KINDS = ['breathing', 'movement', 'journaling', 'screenBreak'] as const
export type DailyHabitKind = (typeof DAILY_HABIT_KINDS)[number]
export type DailyHabitToday = { kind: DailyHabitKind; doneToday: boolean }
type Result<T> = { data: T } | { error: string }

function allowedKind(value: unknown): value is DailyHabitKind {
  return typeof value === 'string' && DAILY_HABIT_KINDS.some((kind) => kind === value)
}

function decodeHabit(value: unknown): DailyHabitToday | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const record = value as Record<string, unknown>
  if (!allowedKind(record.kind) || typeof record.doneToday !== 'boolean') return null
  return { kind: record.kind, doneToday: record.doneToday }
}

function decodeList(value: unknown): DailyHabitToday[] | null {
  if (!Array.isArray(value) || value.length > DAILY_HABIT_KINDS.length) return null
  const entries: DailyHabitToday[] = []
  for (const raw of value) {
    const item = decodeHabit(raw)
    if (!item || entries.some((entry) => entry.kind === item.kind)) return null
    entries.push(item)
  }
  return entries
}

function zoneParam(value: string | null): string | null {
  return isValidTimeZone(value) ? encodeURIComponent(value) : null
}

async function request<T>(
  session: CustomSession | null,
  url: string,
  method: string,
  decode: (value: unknown) => T | null,
  body?: Record<string, unknown>
): Promise<Result<T>> {
  const response = await performAuthRequest<unknown>(session, url, { method, body })
  if ('error' in response) return { error: response.error }
  const parsed = decode(response.data)
  return parsed === null ? { error: 'Invalid daily habits response' } : { data: parsed }
}

const url = `${APIUrl}/daily-habits`

export async function getDailyHabits(session: CustomSession | null, timeZone: string | null) {
  const zone = zoneParam(timeZone)
  if (!zone) return { error: 'Valid IANA time zone required' }
  return request(session, `${url}?timeZone=${zone}`, 'GET', decodeList)
}

export async function chooseDailyHabit(session: CustomSession | null, kind: DailyHabitKind, timeZone: string | null) {
  const zone = zoneParam(timeZone)
  if (!zone || !allowedKind(kind)) return { error: 'Invalid habit or timezone' }
  return request(session, `${url}/${kind}?timeZone=${zone}`, 'PUT', (value) => {
    const habit = decodeHabit(value)
    return habit?.kind === kind ? habit : null
  })
}

export async function checkDailyHabit(
  session: CustomSession | null,
  kind: DailyHabitKind,
  completed: boolean,
  timeZone: string | null
) {
  const zone = zoneParam(timeZone)
  if (!zone || !allowedKind(kind) || typeof completed !== 'boolean') return { error: 'Invalid habit check' }
  return request(
    session,
    `${url}/${kind}/today?timeZone=${zone}`,
    'PATCH',
    (value) => {
      const habit = decodeHabit(value)
      return habit?.kind === kind && habit.doneToday === completed ? habit : null
    },
    { completed }
  )
}

export async function removeDailyHabit(session: CustomSession | null, kind: DailyHabitKind) {
  if (!allowedKind(kind)) return { error: 'Invalid habit' }
  return request(session, `${url}/${kind}`, 'DELETE', (value) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null
    const data = value as Record<string, unknown>
    return data.kind === kind && data.selected === false ? { kind, selected: false as const } : null
  })
}
