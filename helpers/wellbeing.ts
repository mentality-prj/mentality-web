import type { MoodRecordEntity } from '@/types/api-responses'

export type WellbeingDimension = 'mood' | 'stressBalance' | 'energy' | 'focus'

export type WellbeingSummaryData = {
  score: number
  recordCount: number
  dimensions: Record<WellbeingDimension, number>
}

/**
 * A self-reported trend indicator, not a clinical or diagnostic score.
 * Four equally weighted 1–5 answers are scaled to 0–100.
 * Stress is inverted so a lower stress response improves the indicator.
 * Incomplete/out-of-range records are omitted rather than filling defaults.
 */
export function calculateWellbeingSummary(
  records: MoodRecordEntity[]
): WellbeingSummaryData | null {
  const values: Array<Record<WellbeingDimension, number>> = []

  for (const record of records) {
    const { moodLevel, stressLevel, energyLevel, focusLevel } = record
    if (
      ![moodLevel, stressLevel, energyLevel, focusLevel].every(
        (value) => typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 5
      )
    ) {
      continue
    }

    // TypeScript cannot infer that every element passed the array validator.
    const mood = moodLevel as number
    values.push({
      mood: ((mood - 1) / 4) * 100,
      stressBalance: ((5 - stressLevel) / 4) * 100,
      energy: ((energyLevel - 1) / 4) * 100,
      focus: ((focusLevel - 1) / 4) * 100,
    })
  }

  if (values.length === 0) return null

  const dimensions = {
    mood: 0,
    stressBalance: 0,
    energy: 0,
    focus: 0,
  }

  for (const item of values) {
    dimensions.mood += item.mood
    dimensions.stressBalance += item.stressBalance
    dimensions.energy += item.energy
    dimensions.focus += item.focus
  }

  for (const key of Object.keys(dimensions) as WellbeingDimension[]) {
    dimensions[key] = Math.round(dimensions[key] / values.length)
  }

  const score = Math.round((dimensions.mood + dimensions.stressBalance + dimensions.energy + dimensions.focus) / 4)

  return { score, recordCount: values.length, dimensions }
}
