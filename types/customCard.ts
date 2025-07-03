export type BaseCardProps = {
  icon?: React.ReactNode
  disabled?: boolean
  className?: string
}

export type DefaultVariantProps = {
  variant?: 'default'
  title: string
  description: string
} & BaseCardProps

export type SmallVariantProps = {
  variant: 'small'
  title: string
} & BaseCardProps

export type LinkVariantProps = {
  variant: 'link'
  title: string
  href: string
} & BaseCardProps

export type NoninteractiveVariantProps = {
  variant?: 'noninteractive'
  title: string
  description: React.ReactNode
} & BaseCardProps

export type PracticeCardProps = DefaultVariantProps | SmallVariantProps | LinkVariantProps | NoninteractiveVariantProps
