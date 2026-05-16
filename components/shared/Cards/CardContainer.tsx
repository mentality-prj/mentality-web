import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type CardContainerProps = {
  children: ReactNode
  className?: string
}

export default function CardContainer({ children, className }: CardContainerProps) {
  return (
    <section className={cn('w-full bg-background-muted py-6 tablet:py-12 md:py-16', className)}>
      <div className="container-max-width mx-auto px-4 tablet:px-6 md:px-8 lg:px-10">
        <div className="rounded-[32px] bg-white p-4 shadow-sm tablet:p-6 md:p-8">{children}</div>
      </div>
    </section>
  )
}
