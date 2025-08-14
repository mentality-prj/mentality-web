export type BaseDailyCardProps = {
  title: string
  textContent: string
  className?: string
  //   variant?: 'default' | 'secondary'
}

export type DefaultDailyCardProps = {
  variant?: 'default'
  buttonText: string
} & BaseDailyCardProps

export type SecondaryDailyCardProps = {
  variant: 'secondary'
  icon: React.ReactNode
  toastText?: string
} & BaseDailyCardProps

export type DailyCardProps = DefaultDailyCardProps | SecondaryDailyCardProps
