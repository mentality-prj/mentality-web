import { ChartConfig } from '@/ui/chart'
import { MetricKey, PsyTestKey } from '@/types/userStatistics'

/** Ordered list of metric keys used for iteration in cards and chart toggles. */
export const METRIC_KEYS: MetricKey[] = ['mood', 'stress', 'energy', 'focus']

/** ISO weekday numbers (1=Mon … 7=Sun) for heatmap rendering. */
export const ISO_WEEKDAYS = [1, 2, 3, 4, 5, 6, 7] as const

/** Tailwind background + text classes per metric for the MetricCards component. */
export const METRIC_COLORS: Record<MetricKey, string> = {
  mood: 'bg-purple-100 text-purple-700',
  stress: 'bg-red-100 text-red-700',
  energy: 'bg-amber-100 text-amber-700',
  focus: 'bg-blue-100 text-blue-700',
}

/** Recharts config for the 30-day trend area chart (label + color per metric). */
export const TREND_CHART_CONFIG = {
  mood: { label: 'Mood', color: '#905FFF' },
  stress: { label: 'Stress', color: '#B91C1C' },
  energy: { label: 'Energy', color: '#D97706' },
  focus: { label: 'Focus', color: '#2563EB' },
} satisfies ChartConfig

/** Color and max-score per psychological test for LineChart rendering. */
export const PSY_TEST_CONFIG: Record<PsyTestKey, { color: string; maxScore: number }> = {
  k10: { color: '#D97706', maxScore: 50 },
  phq9: { color: '#905FFF', maxScore: 27 },
  gad7: { color: '#2563EB', maxScore: 21 },
}

/** Default toggle state for the trend chart — mood visible, rest hidden. */
export const DEFAULT_VISIBLE_METRICS: Record<MetricKey, boolean> = {
  mood: true,
  stress: false,
  energy: false,
  focus: false,
}
