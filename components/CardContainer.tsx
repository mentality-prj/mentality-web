import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type CardContainerProps = {
  children: ReactNode
  className?: string
}

export default function CardContainer({ children, className }: CardContainerProps) {
  return (
    <section className={cn('w-full bg-[var(--surface-primary)] py-12 md:py-16', className)}>
      <div className="mx-auto max-w-[1440px] px-4 tablet:px-6 md:px-8 lg:px-10">
        <div className="rounded-[32px] bg-white p-8 shadow-sm">{children}</div>
      </div>
    </section>
  )
}
