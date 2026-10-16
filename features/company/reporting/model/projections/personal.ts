import { getReportingCopy } from '@/features/company/reporting/model/reportingCopy'
import type { PersonalRiskOverviewVM, PersonalRiskTimelineVM } from '@/types/reporting'

import { ALWAYS, asObject, asArray, getString, getNumber, getObject, getStringArray, formatNumber, formatSignedNumber, formatPercent, humanizeToken, normalizeRiskLevel, toneFromRiskLevel, riskLevelLabel, normalizeTrendDirection, toneFromTrend, dedupeStrings, mapProjectionConfidence, scaleRiskValue, mapInsightToCard, createMetricCard } from './shared'

export function mapPersonalRiskOverviewProjectionToVM(
  overviewSource: unknown,
  insightsSource: unknown,
  locale?: string
): PersonalRiskOverviewVM {
  const copy = getReportingCopy(locale)
  const overview = asObject(overviewSource)
  const insights = asObject(insightsSource)
  const updatedAt = getString(overview, 'updatedAt', 'computedAt') ?? getString(insights, 'updatedAt', 'computedAt')
  const confidence = mapProjectionConfidence(
    'personal-risk-confidence',
    getObject(overview, 'confidence') ?? getObject(insights, 'confidence'),
    locale
  )
  const currentRiskLevel = normalizeRiskLevel(getString(overview, 'currentRiskLevel', 'riskLevel'))
  const trendDirection = normalizeTrendDirection(getString(overview, 'currentTrend', 'rollingTrend'))
  const predictedRisk = getNumber(overview, 'predictedRisk', 'riskScore')
  const deviationFromBaseline = getNumber(overview, 'deviationFromBaseline', 'baselineDelta')
  const topInsights = [
    ...asArray(insights?.insights).flatMap((item, index) => {
      const insight = asObject(item)
      return insight ? [mapInsightToCard(insight, `personal-insight-${index}`, locale, updatedAt)] : []
    }),
    ...asArray(overview?.mainInsightCards).flatMap((item, index) => {
      const insight = asObject(item)
      return insight ? [mapInsightToCard(insight, `personal-main-insight-${index}`, locale, updatedAt)] : []
    }),
  ].slice(0, 3)

  const fallbackInsights =
    topInsights.length > 0
      ? topInsights
      : [
          createMetricCard(
            'personal-insight-fallback',
            copy.personalRisk.patternStateTitle,
            copy.personalRisk.stablePattern,
            null,
            'positive',
            confidence,
            updatedAt,
            ALWAYS,
            'textInsight'
          ),
        ]

  return {
    currentRiskLevel: createMetricCard(
      'personal-current-risk',
      copy.personalRisk.currentRisk,
      riskLevelLabel(currentRiskLevel, locale),
      predictedRisk != null ? formatPercent(predictedRisk, locale) : null,
      toneFromRiskLevel(currentRiskLevel),
      confidence,
      updatedAt
    ),
    deviationFromBaseline: createMetricCard(
      'personal-baseline-delta',
      copy.personalRisk.deviationFromBaseline,
      deviationFromBaseline != null ? formatSignedNumber(deviationFromBaseline, locale) : copy.common.notAvailable,
      fallbackInsights[0]?.title ?? null,
      toneFromTrend(trendDirection),
      confidence,
      updatedAt,
      ALWAYS,
      'textInsight'
    ),
    confidence,
    recentTrend: createMetricCard(
      'personal-recent-trend',
      copy.personalRisk.recentTrend,
      humanizeToken(getString(overview, 'currentTrend', 'rollingTrend') ?? trendDirection),
      updatedAt,
      toneFromTrend(trendDirection),
      confidence,
      updatedAt,
      ALWAYS,
      'chart'
    ),
    topInsights: fallbackInsights,
    updatedAt,
    whySeeingThis: {
      recentChanges: fallbackInsights.map((item) => item.text),
      contributingFactors: dedupeStrings(
        asArray(insights?.insights).flatMap((item) => getStringArray(asObject(item), 'contributingFactors'))
      ).slice(0, 4),
      dataCompleteness: confidence.label,
      explanationText:
        getString(insights, 'explanationSummary', 'summary') ?? fallbackInsights[0]?.text ?? copy.common.noData,
    },
    visibilityRules: ALWAYS,
  }
}

export function mapPersonalRiskTimelineProjectionToVM(
  timelineSource: unknown,
  period: '7d' | '14d' | '30d',
  locale?: string
): PersonalRiskTimelineVM {
  const copy = getReportingCopy(locale)
  const timeline = asObject(timelineSource)
  const confidenceBand = getObject(timeline, 'confidenceBand')
  const confidence = mapProjectionConfidence(
    `personal-risk-timeline-${period}`,
    confidenceBand ?? getObject(timeline, 'confidence'),
    locale
  )
  const baselineReference = getObject(timeline, 'baselineReference')
  const dataCompleteness = getObject(timeline, 'dataCompleteness')
  const trendDirection = normalizeTrendDirection(getString(timeline, 'rollingTrend', 'trendDirection'))
  const points = asArray(timeline?.timelinePoints).flatMap((item) => {
    const point = asObject(item)
    if (!point) return []

    return [
      {
        label: getString(point, 'bucketKey', 'bucketStart', 'date') ?? copy.common.notAvailable,
        value: scaleRiskValue(getNumber(point, 'predictedRisk', 'riskScore', 'stressLevel', 'value')),
        baseline:
          scaleRiskValue(getNumber(point, 'baselineRisk', 'baselineStress', 'baseline')) ??
          scaleRiskValue(getNumber(baselineReference, 'expectedRisk', 'expectedStress')),
        confidence: getNumber(point, 'confidence', 'completeness') ?? confidence.score,
      },
    ]
  })
  const interpretationSummary = getString(timeline, 'interpretationSummary') ?? copy.common.noData
  const coveredDays = getNumber(dataCompleteness, 'coveredDays')
  const expectedDays = getNumber(dataCompleteness, 'expectedDays')

  return {
    period,
    trendDirection,
    confidence,
    points,
    baselineReferenceLabel:
      getNumber(baselineReference, 'expectedRisk', 'expectedStress') != null
        ? formatNumber(getNumber(baselineReference, 'expectedRisk', 'expectedStress') as number, locale, {
            maximumFractionDigits: 2,
          })
        : copy.common.notAvailable,
    explanationCards: [
      createMetricCard(
        `personal-risk-timeline-summary-${period}`,
        copy.personalRisk.timelineTitle,
        interpretationSummary,
        coveredDays != null && expectedDays != null ? `${coveredDays}/${expectedDays}` : null,
        toneFromTrend(trendDirection),
        confidence,
        getString(timeline, 'updatedAt', 'computedAt'),
        ALWAYS,
        'textInsight'
      ),
    ],
    whySeeingThis: {
      recentChanges: [interpretationSummary],
      contributingFactors: [],
      dataCompleteness:
        coveredDays != null && expectedDays != null ? `${coveredDays}/${expectedDays}` : confidence.label,
      explanationText: interpretationSummary,
    },
    visibilityRules: ALWAYS,
  }
}
