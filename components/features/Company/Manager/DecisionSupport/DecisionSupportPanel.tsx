'use client'

import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

import { DecisionSupportReport, DecisionSupportRiskEvent } from '@/types/decisionSupport'

import { ActionsSection } from './ActionsSection'
import { ExecutiveSummaryCard } from './ExecutiveSummaryCard'
import { FinancialSection } from './FinancialSection'
import { GuardDisclaimer } from './GuardDisclaimer'
import { formatDecisionSupportError } from './helpers'
import { LifecycleSection } from './LifecycleSection'

type Props = {
  report: DecisionSupportReport | null
  riskEvents: DecisionSupportRiskEvent[]
  companyId: string | null
  processingEventIds: Set<string>
  markAddressed: (eventId: string) => Promise<boolean>
  error?: string | null
}

export function DecisionSupportPanel({
  report,
  riskEvents,
  companyId,
  processingEventIds,
  markAddressed,
  error,
}: Props) {
  const t = useTranslations('pages.Company.manager.decisionSupport')
  const [expandedEvidenceEventId, setExpandedEvidenceEventId] = useState<string | null>(null)

  const targetNameById = useMemo(() => {
    const map = new Map<string, string>()

    for (const impact of report?.groupImpacts ?? []) {
      if (impact.groupId && impact.groupName) {
        map.set(impact.groupId, impact.groupName)
      }
    }

    for (const team of report?.teamRanking ?? []) {
      if (team.groupId && team.groupName) {
        map.set(team.groupId, team.groupName)
      }
    }

    for (const group of report?.groupBurnouts ?? []) {
      if (group.groupId && group.groupName) {
        map.set(group.groupId, group.groupName)
      }
    }

    return map
  }, [report])

  const onCreateAction = () => {
    toast(t('actions.createActionHint'))
  }

  const onMarkAddressed = async (eventId: string) => {
    const ok = await markAddressed(eventId)
    if (ok) toast.success(t('actions.markAddressedSuccess'))
  }

  const onToggleEvidence = (eventId: string) => {
    setExpandedEvidenceEventId((prev) => (prev === eventId ? null : eventId))
  }

  const displayError = formatDecisionSupportError(error, t)

  return (
    <div className="flex flex-col gap-6">
      {displayError && <p className="text-destructive text-sm">{displayError}</p>}

      {report?.analyticsGuard && <GuardDisclaimer analyticsGuard={report.analyticsGuard} />}

      <ExecutiveSummaryCard executiveSummary={report?.executiveSummary} />

      <ActionsSection
        report={report}
        targetNameById={targetNameById}
        processingEventIds={processingEventIds}
        onCreateAction={onCreateAction}
        onMarkAddressed={onMarkAddressed}
        onViewRiskEvents={() => setExpandedEvidenceEventId(null)}
      />

      <FinancialSection companyImpact={report?.companyImpact} groupImpacts={report?.groupImpacts ?? []} />

      <LifecycleSection
        companyId={companyId}
        riskEvents={riskEvents}
        expandedEvidenceEventId={expandedEvidenceEventId}
        processingEventIds={processingEventIds}
        onToggleEvidence={onToggleEvidence}
        onMarkAddressed={onMarkAddressed}
      />
    </div>
  )
}
