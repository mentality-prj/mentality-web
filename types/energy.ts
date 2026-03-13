import { StatusType } from '@/types/status.types'

export const ENERGY_LEVELS = ['veryLow', 'low', 'medium', 'high', 'veryHigh'] as const
export type EnergyLevel = (typeof ENERGY_LEVELS)[number]

export type EnergyInfo = {
  value: number
  key: EnergyLevel
  label: string
  color: string
  statusClass: StatusType
}
