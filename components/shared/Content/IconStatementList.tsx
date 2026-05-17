import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type IconStatementListItem = {
  key: string
  icon: ReactNode
  text: string
  iconClassName?: string
  textClassName?: string
}

type IconStatementListProps = {
  items: readonly IconStatementListItem[]
  className?: string
  itemClassName?: string
  dividerClassName?: string
  iconClassName?: string
  textClassName?: string
}

export function IconStatementList({
  items,
  className,
  itemClassName,
  dividerClassName,
  iconClassName,
  textClassName,
}: IconStatementListProps) {
  return (
    <ul className={cn('flex flex-col', className)}>
      {items.map((item, index) => {
        const hasDivider = index < items.length - 1

        return (
          <li key={item.key} className={cn('grid grid-cols-[2rem_minmax(0,1fr)] gap-4', itemClassName)}>
            <div className="flex items-center py-4">
              <span aria-hidden="true" className={cn('flex-none text-[#2f668f]', iconClassName, item.iconClassName)}>
                {item.icon}
              </span>
            </div>

            <div className={cn('min-w-0 py-4', hasDivider && cn('border-b border-black/[0.08]', dividerClassName))}>
              <p
                className={cn(
                  'text-[0.98rem] font-medium leading-relaxed text-textcolor-primary md:text-base',
                  textClassName,
                  item.textClassName
                )}
              >
                {item.text}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
