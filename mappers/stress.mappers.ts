import { STRESS_LEVELS, StressLevel } from '@/types/stress'

export const numberToStressLevel = (n: number): StressLevel | undefined => {
  if (!Number.isFinite(n)) return undefined
  const v = Math.floor(n)
  if (v < 1 || v > STRESS_LEVELS.length) return undefined
  return STRESS_LEVELS[v - 1]
}

export const stressLevelToNumber = (level: StressLevel): number => {
  return STRESS_LEVELS.indexOf(level) + 1
}
