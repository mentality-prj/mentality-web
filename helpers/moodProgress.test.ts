import { calculateMoodProgress } from '@/helpers/moodProgress'
import type { MoodStatistics } from '@/types/userStatistics'

const now = new Date('2026-09-20T14:00:00.000Z')
const stats: MoodStatistics = {
  totalRecords: 25,
  currentStreak: 3,
  longestStreak: 11,
  allTime: { mood: 3, stress: 3, energy: 3, focus: 3 },
  last7d: null,
  last30d: null,
  trend30d: [
    { date: '2026-09-08', mood: 2, stress: 4, energy: 3, focus: 3 },
    { date: '2026-09-12', mood: 3, stress: 3, energy: 3, focus: 3 },
    { date: '2026-09-16', mood: 4, stress: 2, energy: 3, focus: 3 },
    { date: '2026-09-19', mood: 5, stress: 1, energy: 3, focus: 3 },
  ],
  topTags: [],
  weekdayAverages: [],
}

describe('calculateMoodProgress', () => {
  it('computes stress score and compares observed days across adjacent calendar weeks', () => {
    const result = calculateMoodProgress(stats, now)
    expect(result).toMatchObject({
      stressScore: 13,
      recentDays: 2,
      previousDays: 2,
      moodChange: 50,
      stressChange: -50,
      currentStreak: 3,
      longestStreak: 11,
    })
    expect(result.trend).toHaveLength(30)
    expect(result.trend.find((day) => day.date === '2026-09-18')).toMatchObject({
      mood: null,
      stress: null,
    })
  })

  it('does not infer a trend from a single recorded day in a week', () => {
    const result = calculateMoodProgress(
      {
        ...stats,
        trend30d: stats.trend30d.slice(0, 3),
      },
      now
    )
    expect(result.recentDays).toBe(1)
    expect(result.moodChange).toBeNull()
    expect(result.stressChange).toBeNull()
  })

  it('returns no stress score when there are no check-ins this week', () => {
    const result = calculateMoodProgress(
      {
        ...stats,
        trend30d: stats.trend30d.slice(0, 2),
      },
      now
    )
    expect(result.stressScore).toBeNull()
    expect(result.recentDays).toBe(0)
    expect(result.stressChange).toBeNull()
  })

  it('does not treat invalid readings or future observations as actual check-ins', () => {
    const result = calculateMoodProgress(
      {
        ...stats,
        trend30d: [
          ...stats.trend30d,
          { date: '2026-09-20', mood: 100, stress: 0, energy: 3, focus: 3 },
          { date: '2026-09-21', mood: 4, stress: 1, energy: 3, focus: 3 },
        ],
      },
      now
    )
    expect(result.recentDays).toBe(2)
    expect(result.stressScore).toBe(13)
  })
})
