/** Averaged mood, stress, energy and focus values (1.0–5.0 scale). */
export type AverageMetrics = {
  mood: number
  stress: number
  energy: number
  focus: number
}

/** Single day's averaged metrics from `GET /user-statistics/mood → trend30d`. */
export type DailyPoint = {
  date: string
  mood: number
  stress: number
  energy: number
  focus: number
}

/** Tag with its usage count from `topTags`. */
export type TopTag = {
  tag: string
  count: number
}

/** Average mood for a specific ISO weekday (1=Mon … 7=Sun). */
export type WeekdayAverage = {
  weekday: number
  mood: number
  count: number
}

/** Response shape for `GET /user-statistics/mood`. */
export type MoodStatistics = {
  totalRecords: number
  currentStreak: number
  longestStreak: number
  allTime: AverageMetrics
  last7d: AverageMetrics | null
  last30d: AverageMetrics | null
  trend30d: DailyPoint[]
  topTags: TopTag[]
  weekdayAverages: WeekdayAverage[]
}

/** Single trend point for a psychological test. */
export type PsyTestTrendPoint = {
  date: string
  score: number
  level: string
}

/** Latest result of a psychological test. */
export type PsyTestLatestResult = {
  score: number
  level: string
  date: string
}

/** Statistics block for a single psychological test (K-10, PHQ-9 or GAD-7). */
export type PsyTestBlock = {
  totalTaken: number
  latest: PsyTestLatestResult | null
  trend: PsyTestTrendPoint[]
}

/** Response shape for `GET /user-statistics/psytests`. */
export type PsyTestsStatistics = {
  k10: PsyTestBlock
  phq9: PsyTestBlock
  gad7: PsyTestBlock
}

export type PsyTestKey = keyof PsyTestsStatistics

export type MetricKey = keyof AverageMetrics

export type TimePeriod = 'allTime' | 'last7d' | 'last30d'
