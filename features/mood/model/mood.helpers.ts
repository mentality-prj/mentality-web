import { levelToMoodKey } from '@/mappers/mood.mappers'

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

export const buildDailySummaries = (records: any[] = []) => {
  const dayMap = records.reduce<Record<string, { count: number; stressSum: number; stressCount: number }>>((acc, r) => {
    const date = r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : 'unknown'
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

/** Returns true if the ISO timestamp falls on the same UTC calendar date as "today" (in UTC). */
export function isSubmittedToday(isoTimestamp: string): boolean {
  const submitted = new Date(isoTimestamp)
  if (Number.isNaN(submitted.getTime())) return false
  const now = new Date()
  return (
    submitted.getUTCFullYear() === now.getUTCFullYear() &&
    submitted.getUTCMonth() === now.getUTCMonth() &&
    submitted.getUTCDate() === now.getUTCDate()
  )
}
