import type { ReactNode } from 'react'

import { StaticCard } from '@/components/shared/Cards/StaticCard'
import { cn } from '@/lib/utils'

type ListProps = {
  items: ReactNode[]
  keyExtractor: (item: ReactNode, index: number) => string
  className?: string
}

export function List({ items, keyExtractor, className }: ListProps) {
  return (
    <ol className={cn('flex flex-col gap-default', className)}>
      {items.map((item, index) => (
        <li key={keyExtractor(item, index)}>
          <StaticCard>
            <div className="flex items-start gap-sm">
              <span
                aria-hidden="true"
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-[0_10px_20px_hsl(var(--primary)/0.18)]"
              >
                {index + 1}
              </span>
              <div className="pt-1 text-sm leading-relaxed text-textcolor-primary">{item}</div>
            </div>
          </StaticCard>
        </li>
      ))}
    </ol>
  )
}
