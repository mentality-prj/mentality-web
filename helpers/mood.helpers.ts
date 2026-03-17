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
  const map = records.reduce<Record<string, number>>((acc, r) => {
    const created = r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : 'unknown'
    acc[created as string] = (acc[created as string] ?? 0) + 1
    return acc
  }, {})

  return Object.entries(map)
    .map(([date, records]) => ({ date, records }))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

/** Returns true if the ISO timestamp falls on the same local calendar date as today. */
export function isSubmittedToday(isoTimestamp: string): boolean {
  const submitted = new Date(isoTimestamp)
  if (Number.isNaN(submitted.getTime())) return false
  const now = new Date()
  return (
    submitted.getFullYear() === now.getFullYear() &&
    submitted.getMonth() === now.getMonth() &&
    submitted.getDate() === now.getDate()
  )
}
