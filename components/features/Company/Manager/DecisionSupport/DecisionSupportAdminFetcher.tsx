'use client'

import { useDecisionSupport } from '@/hooks/useDecisionSupport'

import { DecisionSupportPanel } from './DecisionSupportPanel'

export function DecisionSupportAdminFetcher() {
  const { companyId, report, riskEvents, loading, error, processingEventIds, markAddressed } = useDecisionSupport()

  if (loading) return null

  return (
    <DecisionSupportPanel
      report={report}
      riskEvents={riskEvents}
      companyId={companyId}
      processingEventIds={processingEventIds}
      markAddressed={markAddressed}
      error={error}
    />
  )
}
