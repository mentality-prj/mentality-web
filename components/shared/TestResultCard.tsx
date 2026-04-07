'use client'

import { type ReactNode } from 'react'

import Card from '@/components/shared/Cards/Card'
import { SectionCard } from '@/ds/components/SectionCard'
import { Link } from '@/i18n/navigation'
import { StatusType } from '@/types/status.types'
import { Button } from '@/ui/button'

export interface TestResultCardProps {
  cardType: StatusType
  cardBorder: string

  /** Primary metric, e.g. "68%" or "12" */
  scoreDisplay: string
  scoreLabel: string

  /** Right column of the score card */
  categoryTitle: string
  categoryLabel: string

  summaryTitle: string
  summaryText: string

  /** Optional note between summary and CTAs (crisis notice, supportive message, etc.) */
  alertContent?: ReactNode

  ctaProgramLabel: string
  ctaRetryLabel: string
  onRetry?: () => void
  /** TODO: Add program link for the primary CTA */
  programHref?: string
}

export function TestResultCard({
  cardType,
  cardBorder,
  scoreDisplay,
  scoreLabel,
  categoryTitle,
  categoryLabel,
  summaryTitle,
  summaryText,
  alertContent,
  ctaProgramLabel,
  ctaRetryLabel,
  onRetry,
  programHref,
}: TestResultCardProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Score card */}
      <div className="flex">
        <Card type={cardType} className={cardBorder}>
          <div className="flex items-center gap-sm">
            <div className="flex flex-col items-start">
              <span className="text-5xl font-bold">{scoreDisplay}</span>
              <span className="mt-1 max-w-[7rem] text-xs font-medium leading-tight opacity-80">{scoreLabel}</span>
            </div>
            <div className="h-12 w-px bg-current opacity-30" />
            <div className="flex flex-col">
              <span className="text-xs font-medium uppercase tracking-wide opacity-70">{categoryTitle}</span>
              <span className="text-xl font-semibold">{categoryLabel}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Summary */}
      <SectionCard title={summaryTitle}>
        <p className="text-sm leading-relaxed text-textcolor-secondary">{summaryText}</p>
      </SectionCard>

      {alertContent}

      {/* CTA buttons */}
      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        {/* TODO: Show program after Result */}
        {programHref && (
          <Link
            href={programHref}
            className="flex-1 rounded-full border border-primary bg-primary px-6 py-3 text-sm font-medium text-white transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {ctaProgramLabel}
          </Link>
        )}

        {onRetry && (
          <Button variant="secondary" onClick={onRetry} className="flex-1">
            {ctaRetryLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
