import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface SummaryCardProps {
  title: string
  children: ReactNode
  icon?: ReactNode
  className?: string
}

export const SummaryCard = ({ title, children, icon, className }: SummaryCardProps) => {
  return (
    <div className={cn('relative flex min-h-40 w-full flex-col gap-6', className)}>
      {icon && <div className="pointer-events-none absolute -top-2 right-0">{icon}</div>}
      <h4>{title}</h4>
      <div className="z-10">{children}</div>
    </div>
  )
}
