import { getReportingCopy } from '@/features/company/reporting/model/reportingCopy'
import type { MLInspectionVM } from '@/types/reporting'

import { ALWAYS, asObject, asArray, getString, getNumber, getObject, formatNumber, formatPercent, humanizeToken, normalizeRiskLevel, toneFromRiskLevel, dedupeStrings, mapProjectionConfidence, flattenDiagnostics, mapInsightToCard, createMetricCard } from './shared'

export function mapMLInspectionProjectionToVM(
  operationalSource: unknown,
  diagnosticsSource: unknown,
  policyMetricsSource: unknown,
  targetType: 'company' | 'team',
  targetId: string,
  locale?: string
): MLInspectionVM {
  const copy = getReportingCopy(locale)
  const operational = asObject(operationalSource)
  const diagnostics = asObject(diagnosticsSource)
  const policyMetrics = asObject(policyMetricsSource)
  const updatedAt =
    getString(operational, 'updatedAt', 'computedAt') ?? getString(diagnostics, 'updatedAt', 'computedAt')
  const confidence = mapProjectionConfidence('ml-inspection-confidence', getObject(operational, 'confidence'), locale)

  const details = [
    ...asArray(operational?.selectedOperationalMetrics).flatMap((item, index) => {
      const metric = asObject(item)
      if (!metric) return []

      const title = getString(metric, 'label', 'key') ?? humanizeToken(`metric ${index + 1}`)
      const numericValue = getNumber(metric, 'value')
      const unit = getString(metric, 'unit')
      const text =
        numericValue != null
          ? unit === 'percent' || numericValue <= 1
            ? formatPercent(numericValue, locale)
            : formatNumber(numericValue, locale, { maximumFractionDigits: 2 })
          : (getString(metric, 'valueLabel') ?? copy.common.notAvailable)

      return [
        createMetricCard(
          `ml-metric-${index}`,
          title,
          text,
          getString(metric, 'description'),
          'neutral',
          confidence,
          updatedAt,
          ALWAYS,
          'textInsight'
        ),
      ]
    }),
    ...asArray(operational?.interpretationCards).flatMap((item, index) => {
      const insight = asObject(item)
      return insight ? [mapInsightToCard(insight, `ml-insight-${index}`, locale, updatedAt)] : []
    }),
  ].slice(0, 8)

  const diagnosticsFacts = dedupeStrings([
    getNumber(policyMetrics, 'totalEvents', 'totalRiskEvents') != null
      ? `${copy.diagnostics.totalEvents}: ${formatNumber(getNumber(policyMetrics, 'totalEvents', 'totalRiskEvents') as number, locale, { maximumFractionDigits: 0 })}`
      : null,
    getNumber(policyMetrics, 'drift', 'driftScore') != null
      ? `${copy.diagnostics.drift}: ${formatNumber(getNumber(policyMetrics, 'drift', 'driftScore') as number, locale, { maximumFractionDigits: 2 })}`
      : null,
    getNumber(policyMetrics, 'calibration', 'calibrationScore') != null
      ? `${copy.diagnostics.calibration}: ${formatNumber(getNumber(policyMetrics, 'calibration', 'calibrationScore') as number, locale, { maximumFractionDigits: 2 })}`
      : null,
    getString(diagnostics, 'stateSpace')
      ? `${copy.diagnostics.stateSpace}: ${getString(diagnostics, 'stateSpace')}`
      : null,
    getString(diagnostics, 'predictedNextState')
      ? `${copy.diagnostics.predictedNextState}: ${getString(diagnostics, 'predictedNextState')}`
      : null,
    getNumber(diagnostics, 'coupling', 'couplingScore') != null
      ? `${copy.diagnostics.coupling}: ${formatNumber(getNumber(diagnostics, 'coupling', 'couplingScore') as number, locale, { maximumFractionDigits: 2 })}`
      : null,
    getNumber(diagnostics, 'synchronization', 'synchronizationScore') != null
      ? `${copy.diagnostics.synchronization}: ${formatNumber(getNumber(diagnostics, 'synchronization', 'synchronizationScore') as number, locale, { maximumFractionDigits: 2 })}`
      : null,
    getNumber(policyMetrics, 'modelTrust', 'trustScore') != null
      ? `${copy.diagnostics.modelTrust}: ${formatNumber(getNumber(policyMetrics, 'modelTrust', 'trustScore') as number, locale, { maximumFractionDigits: 2 })}`
      : null,
  ]).map((value) => {
    const [label, ...rest] = value.split(': ')
    return { label, value: rest.join(': ') }
  })

  return {
    targetType,
    targetId,
    cards: {
      riskScore: createMetricCard(
        'ml-risk-score',
        copy.diagnostics.riskScore,
        getNumber(operational, 'riskScore') != null
          ? formatPercent(getNumber(operational, 'riskScore') as number, locale)
          : copy.common.notAvailable,
        null,
        toneFromRiskLevel(normalizeRiskLevel(getString(operational, 'riskLevel'))),
        confidence,
        updatedAt
      ),
      anomaly: createMetricCard(
        'ml-anomaly',
        copy.diagnostics.anomaly,
        getNumber(operational, 'anomalyScore') != null
          ? formatPercent(getNumber(operational, 'anomalyScore') as number, locale)
          : copy.common.notAvailable,
        null,
        'neutral',
        confidence,
        updatedAt
      ),
      probability: createMetricCard(
        'ml-probability',
        copy.diagnostics.probability,
        getNumber(operational, 'predictionProbability') != null
          ? formatPercent(getNumber(operational, 'predictionProbability') as number, locale)
          : copy.common.notAvailable,
        null,
        'neutral',
        confidence,
        updatedAt
      ),
      modelVersion: createMetricCard(
        'ml-model-version',
        copy.diagnostics.modelVersion,
        getString(operational, 'modelVersion') ?? getString(diagnostics, 'modelVersion') ?? copy.common.notAvailable,
        null,
        'neutral',
        confidence,
        updatedAt,
        ALWAYS,
        'textInsight'
      ),
    },
    details,
    diagnostics:
      diagnosticsFacts.length > 0
        ? diagnosticsFacts
        : flattenDiagnostics(getObject(diagnostics, 'rawFeatureVector')).slice(0, 12),
    confidence,
    visibilityRules: ALWAYS,
  }
}
