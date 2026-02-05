export const STRESS_LEVELS = ['absent', 'low', 'medium', 'high', 'veryHigh'] as const
export type StressLevel = (typeof STRESS_LEVELS)[number]

export type StressInfo = {
  value: number
  key: StressLevel
  label: string
  color: string
}
