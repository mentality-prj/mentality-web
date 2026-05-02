import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type StaticCardProps = {
  children: ReactNode
  className?: string
}

export function StaticCard({ children, className }: StaticCardProps) {
  return <div className={cn('rounded-2xl bg-white p-6', className)}>{children}</div>
}
