import { ReactNode } from 'react'

export interface CalendarProps {
  title: string
  subtitle: ReactNode
  activeLabel: string
  inactiveLabel: string
  selectedDays: SelectedDays
}

export type SelectedDays = Date[]
