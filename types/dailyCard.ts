import { Affirmation } from './affirmation'

export type BaseDailyCardProps = {
  className?: string
} & Affirmation

export type DefaultDailyCardProps = {
  type: 'affirmation' | 'tip'
  variant?: 'default'
} & BaseDailyCardProps

export type SecondaryDailyCardProps = {
  title: string
  textContent: string
  variant: 'secondary'
  icon: React.ReactNode
  toastText?: string
  className?: string
}

export type PreviousDailyCardProps = {
  id: string
  date: string
  variant: 'previous'
  tag: string
  toastText?: string
  textContent: {
    uk: string
    en: string
    pl: string
  }
  className?: string
}

export type DailyCardProps = DefaultDailyCardProps | SecondaryDailyCardProps | PreviousDailyCardProps
