import type { ReactNode } from 'react'

export type CustomCardProps = {
  title?: string
  icon?: ReactNode
  variant?: 'default' | 'daily' | 'withDate'
  text: string
  button?: ReactNode
  backgroundIcon?: ReactNode
  textLink?: string
  hrefLink?: string
  date?: string
  badge?: string
  tagList?: string[]
  className?: string
}
