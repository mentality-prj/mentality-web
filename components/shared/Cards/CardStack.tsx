import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type CardStackProps = {
  children: ReactNode
  className?: string
  cols?: number
}

const CardStack = ({ children, className, cols }: CardStackProps) => {
  const gridCols = cols ? `grid-cols-${cols}` : 'grid-cols-1'

  return (
    <section className={cn(`grid w-full gap-default ${gridCols} container-max-width bg-background`, className)}>
      {children}
    </section>
  )
}

export default CardStack
