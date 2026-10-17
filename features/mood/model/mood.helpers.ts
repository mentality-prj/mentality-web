import { levelToMoodKey } from '@/mappers/mood.mappers'
import { getLocalDayKey, isValidTimeZone } from '@/utils/timeZone'

export const buildMoodMarksData = (records: any[] = []) => {
  return records.reduce<Record<string, number>>((acc, record) => {
    const raw = record.moodLevel
    let key: string | undefined

    if (typeof raw === 'number') {
      key = levelToMoodKey(raw)
    } else if (typeof raw === 'string') {
      // numeric string -> convert to key, otherwise assume it's already a mood key
      if (/^\d+$/.test(raw)) {
        key = levelToMoodKey(Number(raw))
      } else {
        key = raw
      }
    }

    if (key) {
      acc[key as string] = (acc[key as string] ?? 0) + 1
    }

    return acc
  }, {})
}

export const buildDailySummaries = (records: any[] = [], timeZone?: string) => {
  const dayMap = records.reduce<Record<string, { count: number; stressSum: number; stressCount: number }>>((acc, r) => {
    const instant = r.createdAt ? new Date(r.createdAt) : null
    const date = instant && !Number.isNaN(instant.getTime())
      ? timeZone && isValidTimeZone(timeZone)
        ? (getLocalDayKey(instant, timeZone) ?? 'unknown')
        : instant.toISOString().slice(0, 10)
      : 'unknown'
    if (!acc[date]) acc[date] = { count: 0, stressSum: 0, stressCount: 0 }
    acc[date].count += 1
    if (typeof r.stressLevel === 'number') {
      acc[date].stressSum += r.stressLevel
      acc[date].stressCount += 1
    }
    return acc
  }, {})

  return Object.entries(dayMap)
    .map(([date, { count, stressSum, stressCount }]) => ({
      date,
      records: count,
      stress: stressCount > 0 ? Math.round((stressSum / stressCount) * 10) / 10 : undefined,
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

/** Unknown or invalid zone cannot confirm the current calendar day. */
export function isSubmittedToday(isoTimestamp: string, timeZone: string | null, now = new Date()): boolean {
  if (typeof isoTimestamp !== 'string' || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/.test(isoTimestamp)) {
    return false
  }
  const submittedDay = getLocalDayKey(new Date(isoTimestamp), timeZone)
  return submittedDay !== null && submittedDay === getLocalDayKey(now, timeZone)
}
