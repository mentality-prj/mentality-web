import type { StressInfo } from '@/types/stress'

export const STRESSES: StressInfo[] = [
  { value: 0, key: 'absent', label: 'labelsStress.absent', color: 'hsl(var(--support))' },
  { value: 1, key: 'low', label: 'labelsStress.low', color: 'hsl(var(--success))' },
  { value: 2, key: 'medium', label: 'labelsStress.medium', color: 'hsl(var(--info))' },
  { value: 3, key: 'high', label: 'labelsStress.high', color: 'hsl(var(--warning))' },
  { value: 4, key: 'veryHigh', label: 'labelsStress.veryHigh', color: 'hsl(var(--error))' },
]
