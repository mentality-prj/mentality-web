// cardVariants.ts
import { cva } from 'class-variance-authority'

import { Card, CardContent, CardDescription, CardTitle } from '@/ds/shadcn/card'
import { cn } from '@/lib/utils'
import { PracticeCardProps, SmallWithChildrenVariantProps } from '@/types/customCard'

export const cardVariants = cva(
  'flex flex-col w-full h-full rounded-md border-outline-secondary bg-surface-primary shadow-none hover:bg-secondary-hover focus:bg-secondary-focus active:bg-secondary-pressed aria-disabled:bg-disable',
  {
    variants: {
      variant: {
        smallWithChildren: 'bg-transparent gap-4 p-6 hover:bg-transparent focus:bg-transparent active:bg-transparent',
      },
    },
    defaultVariants: {},
  }
)

export const CustomCard: React.FC<PracticeCardProps> = (props) => {
  const variant = props.variant ?? 'default'
  const { className, disabled } = props

  if (variant === 'smallWithChildren') {
    const { title, icon, description, children } = props as SmallWithChildrenVariantProps
    return (
      <Card aria-disabled={disabled} className={cn(cardVariants({ variant }), className)}>
        <CardContent className="flex h-full flex-col gap-3 p-0">
          <CardTitle className="flex flex-row gap-2 text-base font-semibold text-textcolor-primary">
            {icon && <div className="h-6 w-6 [&>svg]:h-6 [&>svg]:w-6">{icon}</div>}
            {title}
          </CardTitle>
          <CardDescription className="grow text-base font-normal text-textcolor-secondary">
            {description}
          </CardDescription>
          {children && <div className="">{children}</div>}
        </CardContent>
      </Card>
    )
  }
}
