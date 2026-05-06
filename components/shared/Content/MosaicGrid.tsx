import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type MediumSpan = 1 | 2 | 3 | 4 | 5 | 6
type XlSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
type XlRowSpan = 1 | 2 | 3
type ItemAlign = 'start' | 'center' | 'end' | 'stretch'

const mediumSpanClasses: Record<MediumSpan, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  6: 'md:col-span-6',
}

const xlSpanClasses: Record<XlSpan, string> = {
  1: 'xl:col-span-1',
  2: 'xl:col-span-2',
  3: 'xl:col-span-3',
  4: 'xl:col-span-4',
  5: 'xl:col-span-5',
  6: 'xl:col-span-6',
  7: 'xl:col-span-7',
  8: 'xl:col-span-8',
  9: 'xl:col-span-9',
  10: 'xl:col-span-10',
  11: 'xl:col-span-11',
  12: 'xl:col-span-12',
}

const xlRowSpanClasses: Record<XlRowSpan, string> = {
  1: 'xl:row-span-1',
  2: 'xl:row-span-2',
  3: 'xl:row-span-3',
}

const itemAlignClasses: Record<ItemAlign, string> = {
  start: 'self-start',
  center: 'self-center',
  end: 'self-end',
  stretch: 'self-stretch',
}

type MosaicGridProps = {
  children: ReactNode
  className?: string
}

type MosaicGridItemProps = {
  children: ReactNode
  className?: string
  mdSpan?: MediumSpan
  xlSpan?: XlSpan
  xlRowSpan?: XlRowSpan
  align?: ItemAlign
}

export function MosaicGrid({ children, className }: MosaicGridProps) {
  return <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-6 xl:grid-cols-12', className)}>{children}</div>
}

export function MosaicGridItem({
  children,
  className,
  mdSpan = 6,
  xlSpan = 4,
  xlRowSpan = 1,
  align = 'stretch',
}: MosaicGridItemProps) {
  return (
    <div
      className={cn(
        'h-full min-w-0 [&>*]:h-full [&>*]:w-full',
        mediumSpanClasses[mdSpan as MediumSpan],
        xlSpanClasses[xlSpan as XlSpan],
        xlRowSpanClasses[xlRowSpan as XlRowSpan],
        itemAlignClasses[align as ItemAlign],
        className
      )}
    >
      {children}
    </div>
  )
}
