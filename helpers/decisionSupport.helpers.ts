import { DECISION_SUPPORT_SEVERITY_RANK } from '@/constants/decisionSupport'
import { DecisionSupportRiskEvent, RiskEventViewModel } from '@/types/decisionSupport'

export function toDecisionSupportLocale(locale: string | undefined): string {
  switch (locale) {
    case 'en':
      return 'en-US'
    case 'pl':
      return 'pl-PL'
    case 'uk':
    default:
      return 'uk-UA'
  }
}

function formatEur(value: number, locale?: string): string {
  return new Intl.NumberFormat(toDecisionSupportLocale(locale), {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function normalizeDecisionSupportConfidence(confidence: number | string | null): number | null {
  if (typeof confidence === 'number') {
    if (!Number.isFinite(confidence)) return null
    return confidence > 1 ? confidence / 100 : confidence
  }

  const parsed = Number(confidence)
  if (!Number.isFinite(parsed)) return null
  return parsed > 1 ? parsed / 100 : parsed
}

function formatFinancialRange(event: DecisionSupportRiskEvent, locale?: string): string | null {
  if (event.financialImpactRange) {
    return event.financialImpactRange
  }

  const min = typeof event.financialImpactMinEur === 'number' ? event.financialImpactMinEur : null
  const max = typeof event.financialImpactMaxEur === 'number' ? event.financialImpactMaxEur : null

  if (min !== null && max !== null) {
    return `${formatEur(Math.round(min), locale)} - ${formatEur(Math.round(max), locale)}`
  }

  if (typeof event.estimatedImpactEur === 'number') {
    return formatEur(Math.round(event.estimatedImpactEur), locale)
  }

  return null
}

export function toRiskEventViewModel(event: DecisionSupportRiskEvent, locale?: string): RiskEventViewModel {
  return {
    id: event.id,
    severity: event.severity,
    confidence: event.confidence ?? null,
    explanationShort: event.explanationShort ?? event.shortExplanation ?? event.explanation ?? event.title,
    financialRange: formatFinancialRange(event, locale),
    status: event.status ?? null,
  }
}

export function compareRiskEventsBySeverityAndConfidence(a: RiskEventViewModel, b: RiskEventViewModel): number {
  const severityDiff =
    (DECISION_SUPPORT_SEVERITY_RANK[b.severity ?? ''] ?? 0) - (DECISION_SUPPORT_SEVERITY_RANK[a.severity ?? ''] ?? 0)
  if (severityDiff !== 0) {
    return severityDiff
  }

  const confidenceA = normalizeDecisionSupportConfidence(a.confidence) ?? 0
  const confidenceB = normalizeDecisionSupportConfidence(b.confidence) ?? 0

  if (Number.isFinite(confidenceA) && Number.isFinite(confidenceB)) {
    return confidenceB - confidenceA
  }

  return 0
}
