import type { DailyPoint, MoodStatistics } from '@/types/userStatistics'

const DAYS_IN_WEEK = 7
const DAYS_IN_MONTH = 30
const STRESS_SCALE_MAX = 5
const STRESS_SCALE_MIN = 1
const PERCENT = 100

export type MoodProgressData = {
  stressScore: number | null
  recentDays: number
  previousDays: number
  moodChange: number | null
  stressChange: number | null
  currentStreak: number
  longestStreak: number
  totalRecords: number
  trend: Array<{ date: string; mood: number | null; stress: number | null }>
}

/** Self-reported score: 0=minimum stress, 100=maximum stress (not a clinical scale). */
function toScore(value: number): number {
  return Math.round(((value - STRESS_SCALE_MIN) / (STRESS_SCALE_MAX - STRESS_SCALE_MIN)) * PERCENT)
}

function validLevel(value: number): boolean {
  return Number.isFinite(value) && value >= STRESS_SCALE_MIN && value <= STRESS_SCALE_MAX
}

function average(points: DailyPoint[], field: 'mood' | 'stress'): number | null {
  const values = points.map((point) => point[field]).filter(validLevel)
  if (!values.length) return null
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

/**
 * Compares seven calendar days with the preceding seven calendar days.
 * Each observed day gets equal weight. Missing days stay missing, not zero.
 * Backend daily date buckets and streaks currently use UTC.
 */
export function calculateMoodProgress(stats: MoodStatistics, now: Date = new Date()): MoodProgressData {
  const today = new Date(now)
  today.setUTCHours(0, 0, 0, 0)
  const todayMs = today.getTime()
  const oneDayMs = 24 * 60 * 60 * 1000

  const startOf = (daysAgo: number): string => new Date(todayMs - daysAgo * oneDayMs).toISOString().slice(0, 10)
  const lastDay = startOf(0)
  const recentStart = startOf(DAYS_IN_WEEK - 1)
  const previousStart = startOf(DAYS_IN_WEEK * 2 - 1)
  const previousEnd = startOf(DAYS_IN_WEEK)
  const monthStart = startOf(DAYS_IN_MONTH - 1)

  const valid = (stats.trend30d ?? []).filter(
    (point) =>
      /^\d{4}-\d{2}-\d{2}$/.test(point.date) &&
      point.date >= monthStart &&
      point.date <= lastDay &&
      validLevel(point.mood) &&
      validLevel(point.stress)
  )
  const recent = valid.filter((point) => point.date >= recentStart)
  const previous = valid.filter((point) => point.date >= previousStart && point.date <= previousEnd)

  const currentMood = average(recent, 'mood')
  const earlierMood = average(previous, 'mood')
  const currentStress = average(recent, 'stress')
  const earlierStress = average(previous, 'stress')

  // A single observed day is not a robust week-over-week comparison.
  const hasComparison = recent.length >= 2 && previous.length >= 2

  const trendByDay = new Map(valid.map((point) => [point.date, point]))
  const trend = Array.from({ length: DAYS_IN_MONTH }, (_, i) => {
    const date = startOf(DAYS_IN_MONTH - 1 - i)
    const point = trendByDay.get(date)
    return { date, mood: point?.mood ?? null, stress: point?.stress ?? null }
  })

  return {
    stressScore: currentStress === null ? null : toScore(currentStress),
    recentDays: recent.length,
    previousDays: previous.length,
    moodChange:
      hasComparison && currentMood !== null && earlierMood !== null
        ? Math.round((currentMood - earlierMood) * 25)
        : null,
    stressChange:
      hasComparison && currentStress !== null && earlierStress !== null
        ? Math.round((currentStress - earlierStress) * 25)
        : null,
    currentStreak: Math.max(0, stats.currentStreak ?? 0),
    longestStreak: Math.max(0, stats.longestStreak ?? 0),
    totalRecords: Math.max(0, stats.totalRecords ?? 0),
    trend,
  }
}
