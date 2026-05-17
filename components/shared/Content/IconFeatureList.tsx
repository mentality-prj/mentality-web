import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type IconFeatureListItem = {
  key: string
  icon: ReactNode
  title: string
  description?: string
  iconClassName?: string
}

type IconFeatureListProps = {
  items: IconFeatureListItem[]
  className?: string
  itemClassName?: string
  titleClassName?: string
  descriptionClassName?: string
  iconWrapperClassName?: string
  dividerClassName?: string
  compact?: boolean
}

export function IconFeatureList({
  items,
  className,
  itemClassName,
  titleClassName,
  descriptionClassName,
  iconWrapperClassName,
  dividerClassName,
  compact = false,
}: IconFeatureListProps) {
  return (
    <ul className={cn('flex flex-col', className)}>
      {items.map((item, index) => {
        const hasDivider = index < items.length - 1
        const verticalPaddingClassName = compact ? 'py-3' : 'py-4'

        return (
          <li key={item.key} className={cn('grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4', itemClassName)}>
            <div className={cn('flex items-start', verticalPaddingClassName)}>
              <span
                aria-hidden="true"
                className={cn(
                  'flex h-11 w-11 flex-none items-center justify-center rounded-full bg-background-muted text-textcolor-primary',
                  iconWrapperClassName,
                  item.iconClassName
                )}
              >
                {item.icon}
              </span>
            </div>

            <div
              className={cn(
                'min-w-0 space-y-1',
                verticalPaddingClassName,
                hasDivider && cn('border-black/8 border-b', dividerClassName)
              )}
            >
              <p className={cn('text-base font-semibold leading-snug text-textcolor-primary', titleClassName)}>
                {item.title}
              </p>
              {item.description && (
                <p className={cn('text-sm leading-relaxed text-textcolor-secondary', descriptionClassName)}>
                  {item.description}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
