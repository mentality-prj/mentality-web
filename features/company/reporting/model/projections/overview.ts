import { getReportingCopy } from '@/features/company/reporting/model/reportingCopy'
import type { InsightCardVM, ReportOverviewVM, ReportRankingItemVM } from '@/types/reporting'

import { ALWAYS, asObject, asArray, getString, getNumber, getObject, getStringArray, formatNumber, formatCurrency, humanizeToken, normalizeRiskLevel, toneFromRiskLevel, dedupeStrings, mapProjectionConfidence, mapInsightToCard, createMetricCard } from './shared'

export function mapReportOverviewProjectionToVM(source: unknown, locale?: string): ReportOverviewVM {
  const copy = getReportingCopy(locale)
  const root = asObject(source)
  const companyHealth = getObject(root, 'companyHealthSummary')
  const signalConfidenceSummary = getObject(root, 'signalConfidenceSummary')
  const overallConfidence = mapProjectionConfidence(
    'report-overview-confidence',
    getObject(signalConfidenceSummary, 'overall'),
    locale
  )
  const updatedAt =
    getString(root, 'updatedAt', 'computedAt', 'generatedAt') ??
    getString(getObject(signalConfidenceSummary, 'overall'), 'computedAt', 'updatedAt')

  const topTeam = asArray(root?.topTeamRisks).map(asObject)[0] ?? null
  const companyHealthSummary: InsightCardVM[] = [
    createMetricCard(
      'report-health-total-risk',
      copy.reportOverview.totalEstimatedRisk,
      getNumber(companyHealth, 'totalEstimatedRiskEur') != null
        ? formatCurrency(getNumber(companyHealth, 'totalEstimatedRiskEur') as number, locale)
        : copy.common.notAvailable,
      getString(companyHealth, 'companyHealthStatus'),
      toneFromRiskLevel(normalizeRiskLevel(getString(companyHealth, 'burnoutLevel', 'companyHealthStatus'))),
      overallConfidence,
      updatedAt
    ),
    createMetricCard(
      'report-health-top-team',
      copy.reportOverview.topTeam,
      getString(topTeam, 'groupName') ?? copy.common.notAvailable,
      getNumber(topTeam, 'estimatedImpactEur') != null
        ? formatCurrency(getNumber(topTeam, 'estimatedImpactEur') as number, locale)
        : getString(topTeam, 'riskLevel'),
      toneFromRiskLevel(normalizeRiskLevel(getString(topTeam, 'riskLevel'))),
      overallConfidence,
      updatedAt,
      ALWAYS,
      'textInsight'
    ),
    createMetricCard(
      'report-health-status',
      copy.reportOverview.companyHealthSummary,
      getString(companyHealth, 'companyHealthStatus')
        ? humanizeToken(getString(companyHealth, 'companyHealthStatus') as string)
        : copy.common.notAvailable,
      getNumber(companyHealth, 'burnoutIndex') != null
        ? formatNumber(getNumber(companyHealth, 'burnoutIndex') as number, locale, { maximumFractionDigits: 2 })
        : null,
      toneFromRiskLevel(normalizeRiskLevel(getString(companyHealth, 'burnoutLevel', 'companyHealthStatus'))),
      overallConfidence,
      updatedAt,
      ALWAYS,
      'textInsight'
    ),
  ]

  const actionsList = asArray(root?.mainActions).flatMap((item, index) => {
    const action = asObject(item)
    if (!action) return []

    const priority = normalizeRiskLevel(getString(action, 'priority'))
    const explanation = getString(action, 'explanation', 'description') ?? copy.common.noData
    const target = getString(action, 'target', 'targetLabel')

    return [
      {
        id: `report-action-${index}`,
        title: getString(action, 'title') ?? humanizeToken(`action ${index + 1}`),
        text: explanation,
        supportingText: target,
        tone: priority === 'unknown' ? 'neutral' : toneFromRiskLevel(priority),
        presentation: 'textInsight',
        confidence: overallConfidence,
        recommendedAction: target,
        updatedAt,
        visibilityRules: ALWAYS,
      } satisfies InsightCardVM,
    ]
  })

  const teamRanking: ReportRankingItemVM[] = asArray(root?.topTeamRisks).flatMap((item, index) => {
    const ranking = asObject(item)
    if (!ranking) return []

    const estimatedImpact = getNumber(ranking, 'estimatedImpactEur')
    const burnoutIndex = getNumber(ranking, 'burnoutIndex')

    return [
      {
        id: getString(ranking, 'groupId') ?? `team-${index + 1}`,
        label: getString(ranking, 'groupName') ?? humanizeToken(`team ${index + 1}`),
        rank: index + 1,
        valueLabel:
          estimatedImpact != null
            ? formatCurrency(estimatedImpact, locale)
            : burnoutIndex != null
              ? formatNumber(burnoutIndex, locale, { maximumFractionDigits: 2 })
              : null,
        supportingText: getString(ranking, 'riskLevel', 'trendDirection'),
        visibilityRules: ALWAYS,
      },
    ]
  })

  const signalsSummary = asArray(root?.interpretationCards).flatMap((item, index) => {
    const card = asObject(item)
    return card ? [mapInsightToCard(card, `report-signal-${index}`, locale, updatedAt)] : []
  })

  const executive = getObject(root, 'executiveSummary')
  const executiveSummary: InsightCardVM | null = executive
    ? {
        id: 'report-executive-summary',
        title: copy.reportOverview.executiveSummary,
        text: getString(executive, 'headline', 'summary') ?? copy.common.noData,
        supportingText:
          dedupeStrings([
            ...getStringArray(executive, 'risks').slice(0, 2),
            ...getStringArray(executive, 'recommendations').slice(0, 1),
          ]).join(' · ') || getString(executive, 'overallStatus'),
        tone: toneFromRiskLevel(normalizeRiskLevel(getString(executive, 'overallStatus'))),
        presentation: 'textInsight',
        confidence: overallConfidence,
        recommendedAction: getStringArray(executive, 'recommendations')[0] ?? null,
        updatedAt,
        visibilityRules: ALWAYS,
      }
    : null

  const confidenceStrip = asArray(signalConfidenceSummary?.items).flatMap((item, index) => {
    const confidenceItem = asObject(item)
    const confidence = getObject(confidenceItem, 'confidence') ?? confidenceItem
    if (!confidence) return []

    return [
      mapProjectionConfidence(
        getString(confidenceItem, 'id', 'field', 'label') ?? `report-confidence-${index}`,
        confidence,
        locale
      ),
    ]
  })

  const interpretationGuidance = dedupeStrings([
    ...getStringArray(executive, 'recommendations'),
    ...signalsSummary.map((item) => item.text),
    ...getStringArray(getObject(root, 'analyticsGuard'), 'reasonCodes').map(humanizeToken),
    ...getStringArray(getObject(root, 'governance'), 'rules'),
  ])

  return {
    id: getString(root, 'id') ?? 'report-overview',
    companyHealthSummary,
    actionsList,
    teamRanking,
    signalsSummary,
    interpretationGuidance,
    executiveSummary,
    confidenceStrip: confidenceStrip.length > 0 ? confidenceStrip : [overallConfidence],
    updatedAt,
    hiddenFieldKeys: getStringArray(getObject(root, 'policy'), 'hiddenFieldKeys'),
    visibilityRules: ALWAYS,
  }
}
