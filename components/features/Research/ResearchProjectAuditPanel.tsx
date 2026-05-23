'use client'

import { useLocale, useTranslations } from 'next-intl'

import { StaticCard } from '@/components/shared/Cards/StaticCard'
import {
  formatResearchAuditCreatedAt,
  formatResearchAuditDetails,
  formatResearchAuditEventType,
} from '@/helpers/researchAudit'
import { ResearchAuditEvent } from '@/types/research'

import { ResearchStateCard } from './ResearchStateCard'

type Props = {
  events: ResearchAuditEvent[]
  actorNamesById?: Record<string, string>
}

export function ResearchProjectAuditPanel({ events, actorNamesById = {} }: Props) {
  const t = useTranslations('pages.Research')
  const locale = useLocale()
  const notAvailable = t('common.notAvailable')

  if (events.length === 0) {
    return <ResearchStateCard title={t('panels.audit.emptyTitle')} description={t('panels.audit.emptyDescription')} />
  }

  return (
    <div className="grid gap-4">
      {events.map((event) => {
        const detailLines = formatResearchAuditDetails(event, t, notAvailable)

        return (
          <StaticCard key={event.id}>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-textcolor-secondary">{t('labels.eventType')}</p>
                <p className="mt-1 text-sm text-textcolor-primary">
                  {formatResearchAuditEventType(event.eventType, t)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-textcolor-secondary">{t('labels.actorUserId')}</p>
                <p className="mt-1 text-sm text-textcolor-primary">
                  {actorNamesById[event.actorUserId] || notAvailable}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-textcolor-secondary">{t('labels.createdAt')}</p>
                <p className="mt-1 text-sm text-textcolor-primary">
                  {formatResearchAuditCreatedAt(event.createdAt, locale, notAvailable)}
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-border px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-textcolor-secondary">{t('labels.details')}</p>
              <div className="mt-1 flex flex-col gap-1">
                {detailLines.map((detailLine, index) => (
                  <p key={`${event.id}-detail-${index}`} className="text-sm text-textcolor-primary">
                    {detailLine}
                  </p>
                ))}
              </div>
            </div>
          </StaticCard>
        )
      })}
    </div>
  )
}
