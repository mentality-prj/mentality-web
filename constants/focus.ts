import type { FocusInfo } from '@/types/focus'

export const FOCUSES: FocusInfo[] = [
  { value: 1, key: 'veryLow', label: 'labelsFocus.veryLow', color: 'hsl(var(--error))', statusClass: 'error' },
  { value: 2, key: 'low', label: 'labelsFocus.low', color: 'hsl(var(--warning))', statusClass: 'warn' },
  { value: 3, key: 'medium', label: 'labelsFocus.medium', color: 'hsl(var(--info))', statusClass: 'info' },
  { value: 4, key: 'high', label: 'labelsFocus.high', color: 'hsl(var(--success))', statusClass: 'success' },
  { value: 5, key: 'veryHigh', label: 'labelsFocus.veryHigh', color: 'hsl(var(--support))', statusClass: 'support' },
]
