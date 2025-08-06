export type BaseDailyCardProps = {
  textContent: string
  className?: string
  //   variant?: 'default' | 'secondary'
}

export type DefaultDailyCardProps = {
  title: string
  variant?: 'default'
  buttonText: string
} & BaseDailyCardProps

export type SecondaryDailyCardProps = {
  title: string
  variant: 'secondary'
  icon: React.ReactNode
  toastText?: string
} & BaseDailyCardProps

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
