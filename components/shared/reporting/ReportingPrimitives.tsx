'use client'

import { ReactNode } from 'react'
import { useLocale } from 'next-intl'

import { StaticCard } from '@/components/shared/Cards/StaticCard'
import { getReportingCopy } from '@/helpers/reportingCopy'
import { ConfidenceBadgeVM, ExplainabilityVM, InsightCardVM, WhySeeingThisVM } from '@/types/reporting'

const CONFIDENCE_CLASSES: Record<ConfidenceBadgeVM['level'], string> = {
  high: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-rose-100 text-rose-700',
  unknown: 'bg-slate-100 text-slate-700',
}

type CardShellProps = {
  title: string
  subtitle?: string | null
  footer?: ReactNode
  children: ReactNode
  tone?: InsightCardVM['tone']
  className?: string
}

function CardShell({ title, subtitle, footer, children, className }: CardShellProps) {
  return (
    <StaticCard className={className}>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold tracking-wide text-textcolor-secondary">{title}</h3>
        {subtitle ? <p className="text-xs text-textcolor-secondary">{subtitle}</p> : null}
      </div>
      <div className="mt-4">{children}</div>
      {footer ? <div className="mt-4">{footer}</div> : null}
    </StaticCard>
  )
}

export function ConfidenceIndicator({ badge, compact = false }: { badge: ConfidenceBadgeVM; compact?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <span
        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${CONFIDENCE_CLASSES[badge.level]}`}
      >
        {badge.label}
        {badge.score != null ? ` · ${Math.round(badge.score * 100)}%` : ''}
      </span>
      {!compact ? (
        <div className="space-y-1 text-xs text-textcolor-secondary">
          <p>{badge.reason}</p>
          {badge.improveQualityHint ? <p>{badge.improveQualityHint}</p> : null}
        </div>
      ) : null}
    </div>
  )
}

export function InsightCardPanel({ card, className }: { card: InsightCardVM; className?: string }) {
  return (
    <CardShell
      title={card.title}
      subtitle={card.updatedAt}
      tone={card.tone}
      className={className}
      footer={card.confidence ? <ConfidenceIndicator badge={card.confidence} compact /> : null}
    >
      <p className="text-base font-medium text-textcolor-primary">{card.text}</p>
      {card.supportingText ? <p className="mt-2 text-sm text-textcolor-secondary">{card.supportingText}</p> : null}
      {card.recommendedAction ? (
        <p className="mt-3 text-sm text-textcolor-secondary">{card.recommendedAction}</p>
      ) : null}
    </CardShell>
  )
}

export function ExplainabilityBlock({ explainability }: { explainability: ExplainabilityVM }) {
  const locale = useLocale()
  const copy = getReportingCopy(locale)

  return (
    <CardShell title={copy.explainability.title} tone="neutral">
      <dl className="grid gap-3 text-sm">
        <div>
          <dt className="font-semibold text-textcolor-primary">{copy.explainability.whatHappened}</dt>
          <dd className="mt-1 text-textcolor-secondary">{explainability.whatHappened}</dd>
        </div>
        <div>
          <dt className="font-semibold text-textcolor-primary">{copy.explainability.whyShown}</dt>
          <dd className="mt-1 text-textcolor-secondary">{explainability.whyShown}</dd>
        </div>
        <div>
          <dt className="font-semibold text-textcolor-primary">{copy.explainability.reliability}</dt>
          <dd className="mt-1 text-textcolor-secondary">{explainability.reliability}</dd>
        </div>
        <div>
          <dt className="font-semibold text-textcolor-primary">{copy.explainability.recommendedAction}</dt>
          <dd className="mt-1 text-textcolor-secondary">{explainability.recommendedAction}</dd>
        </div>
      </dl>
    </CardShell>
  )
}

export function StateExplanationCard({ card }: { card: InsightCardVM }) {
  return <InsightCardPanel card={card} />
}

export function WhyAmISeeingThisCard({ value }: { value: WhySeeingThisVM }) {
  const locale = useLocale()
  const copy = getReportingCopy(locale)

  return (
    <CardShell title={copy.personalRisk.whySeeingThis} tone="neutral">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <h4 className="text-sm font-semibold text-textcolor-primary">{copy.personalRisk.recentChanges}</h4>
          <ul className="mt-2 space-y-2 text-sm text-textcolor-secondary">
            {value.recentChanges.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-textcolor-primary">{copy.personalRisk.contributingFactors}</h4>
          <ul className="mt-2 space-y-2 text-sm text-textcolor-secondary">
            {value.contributingFactors.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-textcolor-primary">{copy.personalRisk.dataCompleteness}</h4>
          <p className="mt-2 text-sm text-textcolor-secondary">{value.dataCompleteness}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-textcolor-secondary">{value.explanationText}</p>
    </CardShell>
  )
}
