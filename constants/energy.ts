import type { EnergyInfo } from '@/types/energy'

export const ENERGIES: EnergyInfo[] = [
  { value: 0, key: 'veryLow', label: 'labelsEnergy.veryLow', color: 'hsl(var(--error))', statusClass: 'error' },
  { value: 1, key: 'low', label: 'labelsEnergy.low', color: 'hsl(var(--warning))', statusClass: 'warn' },
  { value: 2, key: 'medium', label: 'labelsEnergy.medium', color: 'hsl(var(--info))', statusClass: 'info' },
  { value: 3, key: 'high', label: 'labelsEnergy.high', color: 'hsl(var(--success))', statusClass: 'success' },
  { value: 4, key: 'veryHigh', label: 'labelsEnergy.veryHigh', color: 'hsl(var(--support))', statusClass: 'support' },
]
