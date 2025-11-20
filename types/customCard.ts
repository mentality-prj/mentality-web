import type { ReactNode } from 'react'

export type BaseCardProps = {
  icon?: ReactNode
  disabled?: boolean
  className?: string
  title?: string
}

export type SmallWithChildrenVariantProps = {
  variant: 'smallWithChildren'
  description?: string
  children?: ReactNode
} & BaseCardProps

export type PracticeCardProps = SmallWithChildrenVariantProps
