import { getReportingCopy } from '@/features/company/reporting/model/reportingCopy'
import type { TeamDynamicsVM } from '@/types/reporting'

import {
  AGGREGATE_ONLY,
  asArray,
  asObject,
  createMetricCard,
  dedupeStrings,
  formatNumber,
  getBoolean,
  getNumber,
  getObject,
  getString,
  getStringArray,
  humanizeToken,
  mapInsightToCard,
  mapProjectionConfidence,
  normalizeRiskLevel,
  scaleRiskValue,
  toneFromRiskLevel,
} from './shared'

export function riskIntensity(value: number | null, masked = false): TeamDynamicsVM['heatmap'][number]['intensity'] {
  if (masked) return 'masked'
  if (value == null) return 'low'
  if (value >= 3.5) return 'high'
  if (value >= 2) return 'medium'
  return 'low'
}

export function mapTeamDynamicsProjectionToVM(
  overviewSource: unknown,
  timelineSource: unknown,
  groupLabel: string | undefined,
  locale?: string
): TeamDynamicsVM {
  const copy = getReportingCopy(locale)
  const overview = asObject(overviewSource)
  const timeline = asObject(timelineSource)
  const summary = getObject(overview, 'summary') ?? overview
  const policy = getObject(overview, 'policy')
  const updatedAt = getString(overview, 'updatedAt', 'computedAt') ?? getString(timeline, 'updatedAt', 'computedAt')
  const confidence = mapProjectionConfidence(
    'team-dynamics-confidence',
    getObject(summary, 'confidence'),
    locale,
    AGGREGATE_ONLY
  )
  const propagatedRisk = scaleRiskValue(getNumber(summary, 'propagatedRisk', 'riskScore'))
  const masked = getBoolean(policy, 'masked') === true
  const insightCards = asArray(overview?.interpretationCards).flatMap((item, index) => {
    const insight = asObject(item)
    return insight
      ? [mapInsightToCard(insight, `team-dynamics-insight-${index}`, locale, updatedAt, AGGREGATE_ONLY)]
      : []
  })

  const keyChanges = dedupeStrings([
    getString(timeline, 'interpretationSummary'),
    getString(summary, 'stressTrend') ? `Stress: ${humanizeToken(getString(summary, 'stressTrend') as string)}` : null,
    getString(summary, 'moodTrend') ? `Mood: ${humanizeToken(getString(summary, 'moodTrend') as string)}` : null,
  ])

  const recommendedInterventions = dedupeStrings([
    ...insightCards.map((item) => item.recommendedAction),
    ...getStringArray(summary, 'recommendedInterventions'),
  ])

  return {
    aggregateTrend: {
      title: copy.teamDynamics.aggregateTrend,
      points: asArray(timeline?.timelinePoints).flatMap((item) => {
        const point = asObject(item)
        if (!point) return []

        return [
          {
            label: getString(point, 'bucketKey', 'bucketStart', 'date') ?? copy.common.notAvailable,
            value: scaleRiskValue(getNumber(point, 'averagePredictedRisk', 'predictedRisk', 'averageStress', 'value')),
            baseline:
              scaleRiskValue(getNumber(point, 'averagePropagatedRisk', 'baselineRisk', 'averageMood', 'baseline')) ??
              propagatedRisk,
            confidence: getNumber(point, 'confidence', 'completeness') ?? confidence.score,
          },
        ]
      }),
    },
    propagationRisk: createMetricCard(
      'team-dynamics-propagation-risk',
      copy.teamDynamics.propagationRisk,
      propagatedRisk != null
        ? formatNumber(propagatedRisk, locale, { maximumFractionDigits: 2 })
        : copy.common.notAvailable,
      getNumber(summary, 'memberCount') != null
        ? formatNumber(getNumber(summary, 'memberCount') as number, locale, { maximumFractionDigits: 0 })
        : (groupLabel ?? null),
      toneFromRiskLevel(normalizeRiskLevel(getString(summary, 'riskLevel'))),
      confidence,
      updatedAt,
      AGGREGATE_ONLY,
      'textInsight'
    ),
    synchronizedDeterioration: createMetricCard(
      'team-dynamics-synchronized',
      copy.teamDynamics.synchronizedDeterioration,
      getBoolean(summary, 'synchronizedDeteriorationSignal')
        ? humanizeToken('worsening synchronized signal')
        : copy.personalRisk.stablePattern,
      getString(timeline, 'interpretationSummary'),
      getBoolean(summary, 'synchronizedDeteriorationSignal') ? 'critical' : 'positive',
      confidence,
      updatedAt,
      AGGREGATE_ONLY,
      'textInsight'
    ),
    confidence,
    insightCards,
    heatmap: [
      {
        id: getString(overview, 'groupId') ?? groupLabel ?? 'team',
        label: groupLabel ?? getString(overview, 'groupId') ?? copy.teamDynamics.title,
        intensity: riskIntensity(propagatedRisk, masked),
        aggregateLabel:
          getNumber(summary, 'memberCount') != null
            ? formatNumber(getNumber(summary, 'memberCount') as number, locale, { maximumFractionDigits: 0 })
            : copy.common.notAvailable,
        visibilityRules: AGGREGATE_ONLY,
      },
    ],
    trendDetail: {
      keyChanges,
      recommendedInterventions,
      privacyState: masked
        ? (getString(policy, 'reason') ?? copy.teamDynamics.masked)
        : (getString(policy, 'privacyState') ?? copy.common.notAvailable),
    },
    visibilityRules: AGGREGATE_ONLY,
  }
}
