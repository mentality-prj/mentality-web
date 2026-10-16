import { getReportingCopy } from '@/features/company/reporting/model/reportingCopy'
import type { RiskEventDetailVM, RiskEventVM } from '@/types/reporting'

import { ALWAYS, getString, getNumber, getObject, getStringArray, formatNumber, humanizeToken, normalizeRiskLevel, dedupeStrings, mapProjectionConfidence, flattenDiagnostics, buildExplainability, JsonObject } from './shared'

export function mapRiskEventProjectionToVM(source: JsonObject, locale?: string, index = 0): RiskEventVM {
  const copy = getReportingCopy(locale)
  const id = getString(source, 'eventId', 'id') ?? `risk-event-${index}`
  const confidence = mapProjectionConfidence(`risk-event-${id}-confidence`, getObject(source, 'confidence'), locale)
  const title = getString(source, 'signal', 'title') ?? humanizeToken(`signal ${index + 1}`)
  const summary = getString(source, 'shortExplanation', 'summary', 'explanation') ?? copy.common.noData
  const target = getObject(source, 'entityTarget')
  const whyShown = getString(target, 'label', 'target', 'name') ?? getString(target, 'targetType') ?? copy.common.noData
  const recommendedActions = dedupeStrings([
    getString(source, 'recommendedAction'),
    ...getStringArray(source, 'recommendedActions'),
  ])
  const lastSeenAt = getString(source, 'lastSeenAt', 'updatedAt', 'createdAt')
  const effectSize = getNumber(source, 'effectSize', 'impactScore', 'predictedRisk')
  const detail: RiskEventDetailVM = {
    status: getString(source, 'status'),
    effectSizeLabel:
      effectSize != null
        ? formatNumber(effectSize <= 1 ? effectSize * 100 : effectSize, locale, {
            maximumFractionDigits: effectSize <= 1 ? 0 : 2,
          })
        : null,
    history: dedupeStrings([
      whyShown !== copy.common.noData ? `${humanizeToken('entity target')}: ${whyShown}` : null,
      lastSeenAt ? `${copy.riskFeed.lastSeenAt}: ${lastSeenAt}` : null,
    ]),
    performedActions: [],
    outcome: getString(source, 'outcome'),
    explainability: buildExplainability(
      summary,
      whyShown,
      confidence.reason,
      recommendedActions[0] ?? copy.common.noData,
      locale
    ),
    recommendedActions,
    diagnostics: flattenDiagnostics(getObject(source, 'debugPayload')).slice(0, 12),
  }

  return {
    id,
    title,
    severity: normalizeRiskLevel(getString(source, 'severity', 'priority')),
    status: getString(source, 'status') ?? 'unknown',
    confidence,
    summary,
    financialRange: getString(source, 'financialImpactRange', 'estimatedImpactRange'),
    lastSeenAt,
    explainability: detail.explainability,
    recommendedActions,
    details: detail,
    visibilityRules: ALWAYS,
  }
}

export function buildRiskEventFallbackDetail(baseEvent: RiskEventVM): RiskEventDetailVM {
  return {
    status: baseEvent.status,
    effectSizeLabel: null,
    history: [],
    performedActions: [],
    outcome: null,
    explainability: baseEvent.explainability,
    recommendedActions: baseEvent.recommendedActions,
    diagnostics: [],
  }
}
