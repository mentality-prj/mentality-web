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
} & BaseDailyCardProps

export type DailyCardProps = DefaultDailyCardProps | SecondaryDailyCardProps
