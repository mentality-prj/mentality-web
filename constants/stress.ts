import type { StressInfo } from '@/types/stress'

export const STRESSES: StressInfo[] = [
  { value: 1, key: 'absent', label: 'labelsStress.absent', color: 'hsl(var(--support))', statusClass: 'support' },
  { value: 2, key: 'low', label: 'labelsStress.low', color: 'hsl(var(--success))', statusClass: 'success' },
  { value: 3, key: 'medium', label: 'labelsStress.medium', color: 'hsl(var(--info))', statusClass: 'info' },
  { value: 4, key: 'high', label: 'labelsStress.high', color: 'hsl(var(--warning))', statusClass: 'warn' },
  { value: 5, key: 'veryHigh', label: 'labelsStress.veryHigh', color: 'hsl(var(--error))', statusClass: 'error' },
]
