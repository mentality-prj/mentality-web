export type MoodKey = 'very-bad' | 'bad' | 'neutral' | 'good' | 'great'

const MOOD_KEY_TO_LEVEL: Record<MoodKey, number> = {
  'very-bad': 1,
  bad: 2,
  neutral: 3,
  good: 4,
  great: 5,
}

export function moodKeyToLevel(key?: string | null): number | undefined {
  if (!key) return undefined
  return (MOOD_KEY_TO_LEVEL as Record<string, number>)[key]
}

export function levelToMoodKey(level: number): MoodKey | undefined {
  const entry = Object.entries(MOOD_KEY_TO_LEVEL).find(([, v]) => v === level)
  return entry ? (entry[0] as MoodKey) : undefined
}

export default { moodKeyToLevel, levelToMoodKey }
