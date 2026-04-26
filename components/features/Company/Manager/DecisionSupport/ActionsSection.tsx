'use client'

import { useTranslations } from 'next-intl'

import Card from '@/components/shared/Cards/Card'
import { SectionCard } from '@/ds/components/SectionCard'
import { DecisionSupportAction, DecisionSupportReport } from '@/types/decisionSupport'
import { Button } from '@/ui/button'

import { eventIdForAction, formatConfidenceValue, formatMappedValue } from './helpers'

type Props = {
  report: DecisionSupportReport | null
  targetNameById: Map<string, string>
  processingEventIds: Set<string>
  onCreateAction: () => void
  onMarkAddressed: (eventId: string) => Promise<void>
  onViewRiskEvents: () => void
}

export function ActionsSection({
  report,
  targetNameById,
  processingEventIds,
  onCreateAction,
  onMarkAddressed,
  onViewRiskEvents,
}: Props) {
  const t = useTranslations('pages.Company.manager.decisionSupport')

  return (
    <SectionCard title={t('actions.title')}>
      {report && report.actions.length === 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-textcolor-secondary">{t('actions.empty')}</p>
          <Button type="button" variant="secondary" onClick={onViewRiskEvents}>
            {t('actions.viewRiskEvents')}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {(report?.actions ?? []).map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              targetNameById={targetNameById}
              processingEventIds={processingEventIds}
              onCreateAction={onCreateAction}
              onMarkAddressed={onMarkAddressed}
            />
          ))}
        </div>
      )}
    </SectionCard>
  )
}

type ActionCardProps = {
  action: DecisionSupportAction
  targetNameById: Map<string, string>
  processingEventIds: Set<string>
  onCreateAction: () => void
  onMarkAddressed: (eventId: string) => Promise<void>
}

function ActionCard({ action, targetNameById, processingEventIds, onCreateAction, onMarkAddressed }: ActionCardProps) {
  const t = useTranslations('pages.Company.manager.decisionSupport')
  const evId = eventIdForAction(action)
  const isProcessing = evId ? processingEventIds.has(evId) : false

  return (
    <Card title={action.title} text={action.description}>
      <dl className="mt-2 grid grid-cols-1 gap-1 text-xs text-textcolor-secondary sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex gap-1">
          <dt className="font-medium">{t('actions.priority')}:</dt>
          <dd>{formatMappedValue(action.priority, t, 'values.level')}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t('actions.severity')}:</dt>
          <dd>{formatMappedValue(action.severity, t, 'values.level')}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t('actions.confidence')}:</dt>
          <dd>{formatConfidenceValue(action.confidence, t)}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t('actions.target')}:</dt>
          <dd>{formatMappedValue(action.target, t, 'values.target')}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t('actions.targetId')}:</dt>
          <dd>{action.targetId ? (targetNameById.get(action.targetId) ?? action.targetId) : '—'}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t('actions.expectedStressReduction')}:</dt>
          <dd>{action.expectedImpact?.stressReduction ?? '—'}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t('actions.expectedRetentionImpact')}:</dt>
          <dd>{action.expectedImpact?.retentionImpact ?? '—'}</dd>
        </div>
      </dl>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" onClick={onCreateAction}>
          {t('actions.createAction')}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => evId && onMarkAddressed(evId)}
          disabled={!evId || isProcessing}
        >
          {t('actions.markAddressed')}
        </Button>
      </div>
    </Card>
  )
}
