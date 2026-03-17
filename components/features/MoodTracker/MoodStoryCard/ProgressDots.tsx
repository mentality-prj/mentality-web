'use client'

import { useTranslations } from 'next-intl'

import { cn } from '@/lib/utils'

interface ProgressDotsProps {
  total: number
  current: number
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  const t = useTranslations('components.MoodStoryCard')
  return (
    <div
      className="flex items-center justify-center gap-2"
      role="status"
      aria-label={t('progressDots.ariaLabel', { current: current + 1, total })}
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            i === current ? 'w-6 bg-primary' : 'w-2 bg-background-muted'
          )}
        />
      ))}
    </div>
  )
}
