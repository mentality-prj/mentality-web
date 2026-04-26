'use client'

import { useTranslations } from 'next-intl'

import { SectionCard } from '@/ds/components/SectionCard'
import { DecisionSupportRiskEvent, DecisionSupportRiskEventStatus } from '@/types/decisionSupport'

import { STATUS_ORDER } from './constants'
import { RiskEventCard } from './RiskEventCard'

type Props = {
  companyId: string | null
  riskEvents: DecisionSupportRiskEvent[]
  expandedEvidenceEventId: string | null
  processingEventIds: Set<string>
  onToggleEvidence: (eventId: string) => void
  onMarkAddressed: (eventId: string) => Promise<void>
}

export function LifecycleSection({
  companyId,
  riskEvents,
  expandedEvidenceEventId,
  processingEventIds,
  onToggleEvidence,
  onMarkAddressed,
}: Props) {
  const t = useTranslations('pages.Company.manager.decisionSupport')

  const groupedEvents = STATUS_ORDER.map((status) => ({
    status,
    items: riskEvents.filter((event) => event.status === status),
  }))

  return (
    <SectionCard title={t('lifecycle.title')}>
      <div className="flex flex-col gap-4">
        {groupedEvents.map((group) => (
          <RiskEventStatusGroup
            key={group.status}
            companyId={companyId}
            status={group.status}
            events={group.items}
            expandedEvidenceEventId={expandedEvidenceEventId}
            processingEventIds={processingEventIds}
            onToggleEvidence={onToggleEvidence}
            onMarkAddressed={onMarkAddressed}
          />
        ))}
      </div>
    </SectionCard>
  )
}

type RiskEventStatusGroupProps = {
  companyId: string | null
  status: DecisionSupportRiskEventStatus
  events: DecisionSupportRiskEvent[]
  expandedEvidenceEventId: string | null
  processingEventIds: Set<string>
  onToggleEvidence: (eventId: string) => void
  onMarkAddressed: (eventId: string) => Promise<void>
}

function RiskEventStatusGroup({
  companyId,
  status,
  events,
  expandedEvidenceEventId,
  processingEventIds,
  onToggleEvidence,
  onMarkAddressed,
}: RiskEventStatusGroupProps) {
  const t = useTranslations('pages.Company.manager.decisionSupport')

  return (
    <SectionCard title={t(`lifecycle.status.${status}` as never)}>
      {events.length === 0 ? (
        <p className="text-sm text-textcolor-secondary">{t('lifecycle.emptyStatus')}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <RiskEventCard
              key={event.id}
              event={event}
              companyId={companyId}
              isExpanded={expandedEvidenceEventId === event.id}
              isProcessing={processingEventIds.has(event.id)}
              onToggleEvidence={onToggleEvidence}
              onMarkAddressed={onMarkAddressed}
            />
          ))}
        </div>
      )}
    </SectionCard>
  )
}
