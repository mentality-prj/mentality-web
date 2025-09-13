import { Affirmation } from './affirmation'

export type BaseDailyCardProps = {
  type: 'affirmation' | 'tip'
  className?: string
} & Affirmation

export type DefaultDailyCardProps = {
  variant?: 'default'
} & BaseDailyCardProps

export type SecondaryDailyCardProps = {
  variant: 'secondary'
} & BaseDailyCardProps

export type PreviousDailyCardProps = {
  variant: 'previous'
} & BaseDailyCardProps

export type DailyCardProps = DefaultDailyCardProps | SecondaryDailyCardProps | PreviousDailyCardProps
