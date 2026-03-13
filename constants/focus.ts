import type { FocusInfo } from '@/types/focus'

export const FOCUSES: FocusInfo[] = [
  { value: 0, key: 'veryLow', label: 'labelsFocus.veryLow', color: 'hsl(var(--error))', statusClass: 'error' },
  { value: 1, key: 'low', label: 'labelsFocus.low', color: 'hsl(var(--warning))', statusClass: 'warn' },
  { value: 2, key: 'medium', label: 'labelsFocus.medium', color: 'hsl(var(--info))', statusClass: 'info' },
  { value: 3, key: 'high', label: 'labelsFocus.high', color: 'hsl(var(--success))', statusClass: 'success' },
  { value: 4, key: 'veryHigh', label: 'labelsFocus.veryHigh', color: 'hsl(var(--support))', statusClass: 'support' },
]
