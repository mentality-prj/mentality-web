// cardVariants.ts
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import {
  DefaultVariantProps,
  LinkVariantProps,
  NoninteractiveVariantProps,
  PracticeCardProps,
} from '@/types/customCard'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../shadcn/card'

export const cardVariants = cva(
  'w-full max-w-[243px] rounded-md border-outline-secondary bg-surface-primary shadow-none hover:bg-secondary-hover focus:bg-secondary-focus active:bg-secondary-pressed aria-disabled:bg-disable',
  {
    variants: {
      variant: {
        default: 'flex flex-col gap-4 p-6',
        small: 'flex px-4 py-3',
        link: 'flex px-4 py-3',
        noninteractive: 'flex flex-col',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export const CustomCard: React.FC<PracticeCardProps> = (props) => {
  const variant = props.variant ?? 'default'
  const { className, disabled } = props

  if (variant === 'small') {
    const { title, icon } = props
    return (
      <Card aria-disabled={disabled} className={cn(cardVariants({ variant }), className)}>
        <CardContent className="flex gap-2 p-0">
          {icon && <div>{icon}</div>}
          <div className="text-base">{title}</div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'link') {
    const { title, href, icon } = props as LinkVariantProps
    return (
      <a href={href}>
        <Card aria-disabled={disabled} className={cn(cardVariants({ variant }), className)}>
          <CardContent className="flex w-full justify-between p-0">
            <div className="text-base">{title}</div>
            {icon && <div>{icon}</div>}
          </CardContent>
        </Card>
      </a>
    )
  }

  if (variant === 'noninteractive') {
    const { title, description, icon } = props as NoninteractiveVariantProps
    return (
      <Card aria-disabled={disabled} className={cn('p-4', cardVariants({ variant }), className)}>
        <CardHeader className="p-0">
          <div className="flex flex-row items-center gap-2">
            {icon && <div className="">{icon}</div>}
            {title && <div className="text-sm font-semibold">{title}</div>}
          </div>
        </CardHeader>
        <CardContent className="mt-1 flex flex-col p-0">
          {description && <CardDescription>{description}</CardDescription>}
        </CardContent>
      </Card>
    )
  }

  // default
  const { title, description, icon } = props as DefaultVariantProps
  return (
    <Card aria-disabled={disabled} className={cn('flex h-full flex-col', cardVariants({ variant }), className)}>
      {icon && <CardHeader className="p-0">{icon}</CardHeader>}

      <CardContent className="flex h-full flex-col gap-3 p-0">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <CardDescription className="grow text-base font-normal">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
