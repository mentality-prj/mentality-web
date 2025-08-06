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
  date: string
  variant: 'previous'
  tag: string
  toastText?: string
} & BaseDailyCardProps

export type DailyCardProps = DefaultDailyCardProps | SecondaryDailyCardProps | PreviousDailyCardProps
