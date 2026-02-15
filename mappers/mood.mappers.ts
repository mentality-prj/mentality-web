import { MoodRecordEntity } from '@/types/api-responses'

export type MoodKey = 'veryBad' | 'bad' | 'neutral' | 'good' | 'great'

const MOOD_KEY_TO_LEVEL: Record<MoodKey, number> = {
  veryBad: 1,
  bad: 2,
  neutral: 3,
  good: 4,
  great: 5,
}

export const MOOD_KEYS: MoodKey[] = Object.keys(MOOD_KEY_TO_LEVEL) as MoodKey[]

export function moodKeyToLevel(key?: string | null): number | undefined {
  if (!key) return undefined
  return (MOOD_KEY_TO_LEVEL as Record<string, number>)[key as string]
}

export function levelToMoodKey(level: number): MoodKey | undefined {
  const entry = Object.entries(MOOD_KEY_TO_LEVEL).find(([, v]) => v === level)
  return entry ? (entry[0] as MoodKey) : undefined
}

export function mapMoodRecordsToCounts(records: MoodRecordEntity[] = []): { mood: string; count: number }[] {
  const moodMap = records.reduce<Record<string, number>>((acc, record) => {
    const raw = record.moodLevel
    let key: string | undefined

    if (typeof raw === 'number') {
      key = levelToMoodKey(raw)
    } else if (typeof raw === 'string') {
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

  return Object.entries(moodMap).map(([mood, count]) => ({ mood, count }))
}
