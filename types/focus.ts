import { StatusType } from '@/types/status.types'

export const FOCUS_LEVELS = ['veryLow', 'low', 'medium', 'high', 'veryHigh'] as const
export type FocusLevel = (typeof FOCUS_LEVELS)[number]

export type FocusInfo = {
  value: number
  key: FocusLevel
  label: string
  color: string
  statusClass: StatusType
}
