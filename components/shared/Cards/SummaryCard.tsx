import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface SummaryCardProps {
  title?: string
  children?: ReactNode
  icon?: ReactNode
  className?: string
  iconOnTop?: boolean
  titleClassName?: string
}

export const SummaryCard = ({
  title,
  children,
  icon,
  className,
  iconOnTop = false,
  titleClassName,
}: SummaryCardProps) => {
  return (
    <div className={cn('relative flex w-full flex-col gap-xs', className)}>
      {icon && (
        <div className={cn('pointer-events-none absolute', iconOnTop ? '-bottom-1 -right-4 z-20' : '-top-2 right-0')}>
          {icon}
        </div>
      )}
      {title && <h4 className={titleClassName}>{title}</h4>}
      <div className="z-10">{children}</div>
    </div>
  )
}
