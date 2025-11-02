import type { ReactNode } from 'react'

export type BaseCardProps = {
  icon?: ReactNode
  disabled?: boolean
  className?: string
  title?: string
}

export type DefaultVariantProps = {
  variant?: 'default'
  description: string
} & BaseCardProps

export type SmallWithChildrenVariantProps = {
  variant: 'smallWithChildren'
  description?: string
  children?: ReactNode
} & BaseCardProps

export type SmallVariantProps = {
  variant: 'small'
} & BaseCardProps

export type LinkVariantProps = {
  variant: 'link'
  href: string
} & BaseCardProps

export type NoninteractiveVariantProps = {
  variant: 'noninteractive'
  description?: ReactNode
} & BaseCardProps

export type RecommendationVariantProps = {
  variant: 'recommendation'
  tag: string
  description: string
} & BaseCardProps

export type PracticeCardProps =
  | DefaultVariantProps
  | SmallWithChildrenVariantProps
  | SmallVariantProps
  | LinkVariantProps
  | NoninteractiveVariantProps
  | RecommendationVariantProps
