import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type GlassPanelProps = {
  children: ReactNode
  className?: string
  backgroundClassName?: string
  glowClassName?: string
  textClassName?: string
}

export function GlassPanel({
  children,
  className,
  backgroundClassName,
  glowClassName,
  textClassName,
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[30px] border border-white/45 bg-white/[0.04] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_24px_60px_rgba(15,23,42,0.12)] ring-1 ring-white/45 backdrop-blur-[24px] backdrop-saturate-[1.8] md:p-8',
        className
      )}
    >
      {backgroundClassName && (
        <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0', backgroundClassName)} />
      )}

      {glowClassName && <div aria-hidden="true" className={cn('pointer-events-none absolute', glowClassName)} />}

      <div className={cn('relative z-10', textClassName)}>{children}</div>
    </div>
  )
}
