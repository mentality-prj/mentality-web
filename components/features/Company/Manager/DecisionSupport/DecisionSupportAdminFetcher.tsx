'use client'

import { useDecisionSupport } from '@/hooks/useDecisionSupport'

import { DecisionSupportPanel } from './DecisionSupportPanel'

export function DecisionSupportAdminFetcher() {
  const {
    riskEvents,
    loading,
    error,
    processingEventIds,
    loadingOutcomeEventIds,
    outcomeByEventId,
    fetchRiskEventOutcome,
    applyAction,
    resolveRisk,
    refresh,
  } = useDecisionSupport()

  return (
    <DecisionSupportPanel
      riskEvents={riskEvents}
      loading={loading}
      processingEventIds={processingEventIds}
      loadingOutcomeEventIds={loadingOutcomeEventIds}
      outcomeByEventId={outcomeByEventId}
      fetchRiskEventOutcome={fetchRiskEventOutcome}
      applyAction={applyAction}
      resolveRisk={resolveRisk}
      refresh={refresh}
      error={error}
    />
  )
}
