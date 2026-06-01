import { getReportingCopy } from '@/helpers/reportingCopy'
import { createConfidenceBadgeVM, mapMlInspectionToVM } from '@/helpers/reportingMappers'
import { logger } from '@/lib/logger'
import { CustomSession } from '@/types/auth'
import { PolicyMetrics } from '@/types/decisionSupport'
import {
  ConfidenceBadgeVM,
  ConfidenceLevel,
  InsightCardVM,
  InsightFactVM,
  MLInspectionVM,
  PersonalRiskOverviewVM,
  PersonalRiskTimelineVM,
  ReportOverviewVM,
  ReportRankingItemVM,
  RiskEventActionKind,
  RiskEventDetailVM,
  RiskEventVM,
  RiskLevel,
  TeamDynamicsVM,
  TrendDirection,
  VisibilityRule,
} from '@/types/reporting'

import { APIUrl } from './config'
import {
  applyDecisionSupportRiskEventAction,
  applyDecisionSupportRiskEventActionAdmin,
  resolveDecisionSupportRiskEvent,
  resolveDecisionSupportRiskEventAdmin,
} from './decisionSupport'
import { performAdminRequest, performAuthRequest } from './genericFetch'

type Result<T> = Promise<{ data: T } | { error: string }>

type DecisionSupportScope = {
  session: CustomSession | null
  companyId: string
  admin?: boolean
  locale?: string
}

type JsonObject = Record<string, unknown>

type TeamDynamicsParams = {
  from: string
  to: string
  groupId: string
  groupLabel?: string
}

const ALWAYS: VisibilityRule[] = ['always']
const AGGREGATE_ONLY: VisibilityRule[] = ['aggregate-only']

function asObject(value: unknown): JsonObject | null {
  return value != null && typeof value === 'object' && !Array.isArray(value) ? (value as JsonObject) : null
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function getString(object: JsonObject | null, ...keys: string[]): string | null {
  if (!object) return null

  for (const key of keys) {
    const value = object[key]
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed) return trimmed
    }
  }

  return null
}

function getNumber(object: JsonObject | null, ...keys: string[]): number | null {
  if (!object) return null

  for (const key of keys) {
    const value = object[key]
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }

    if (typeof value === 'string') {
      const parsed = Number(value)
      if (Number.isFinite(parsed)) {
        return parsed
      }
    }
  }

  return null
}

function getBoolean(object: JsonObject | null, ...keys: string[]): boolean | null {
  if (!object) return null

  for (const key of keys) {
    const value = object[key]
    if (typeof value === 'boolean') {
      return value
    }
  }

  return null
}

function getObject(object: JsonObject | null, key: string): JsonObject | null {
  if (!object) return null
  return asObject(object[key])
}

function getStringArray(object: JsonObject | null, key: string): string[] {
  if (!object) return []

  return asArray(object[key]).flatMap((item) => {
    if (typeof item === 'string') {
      const trimmed = item.trim()
      return trimmed ? [trimmed] : []
    }

    const nested = asObject(item)
    const label = getString(nested, 'label', 'title', 'name', 'value')
    return label ? [label] : []
  })
}

function buildQuery(params: Record<string, string | number | boolean | null | undefined>): string {
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === '') continue
    search.set(key, String(value))
  }

  const query = search.toString()
  return query ? `?${query}` : ''
}

function buildProjectionUrl(path: string): string {
  const baseUrl = APIUrl.trim().replace(/\/+$/, '')
  const normalizedPath = path.trim() ? (path.startsWith('/') ? path : `/${path}`) : ''

  if (!normalizedPath) {
    return baseUrl
  }

  if (baseUrl.endsWith('/api') && normalizedPath === '/api') {
    return baseUrl
  }

  if (baseUrl.endsWith('/api') && normalizedPath.startsWith('/api/')) {
    return `${baseUrl}${normalizedPath.slice(4)}`
  }

  return `${baseUrl}${normalizedPath}`
}

async function requestProjection<T>(
  session: CustomSession | null,
  path: string,
  admin = false,
  options?: { method?: string; body?: Record<string, unknown> | FormData }
): Result<T> {
  const url = buildProjectionUrl(path)
  const response = admin
    ? await performAdminRequest<T>(session, url, options)
    : await performAuthRequest<T>(session, url, options)

  if ('error' in response) {
    logger.error('Failed to request reporting projection', { error: response.error, path, admin })
    return { error: response.error }
  }

  return { data: response.data as T }
}

function normalizeConfidenceLevel(value: string | null | undefined): ConfidenceLevel {
  switch ((value ?? '').toLowerCase()) {
    case 'high':
      return 'high'
    case 'medium':
      return 'medium'
    case 'low':
      return 'low'
    default:
      return 'unknown'
  }
}

function confidenceLevelToScore(level: ConfidenceLevel): number | null {
  switch (level) {
    case 'high':
      return 0.85
    case 'medium':
      return 0.6
    case 'low':
      return 0.3
    default:
      return null
  }
}

function getIntlLocale(locale?: string): string {
  if (locale?.startsWith('uk')) return 'uk-UA'
  if (locale?.startsWith('pl')) return 'pl-PL'
  return 'en-US'
}

function formatNumber(value: number, locale?: string, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(getIntlLocale(locale), options).format(value)
}

function formatSignedNumber(value: number, locale?: string, maximumFractionDigits = 2): string {
  const prefix = value > 0 ? '+' : ''
  return `${prefix}${formatNumber(value, locale, { maximumFractionDigits })}`
}

function formatCurrency(value: number, locale?: string): string {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercent(value: number, locale?: string, maximumFractionDigits = 0): string {
  const normalized = Math.abs(value) <= 1 ? value * 100 : value
  return `${formatNumber(normalized, locale, { maximumFractionDigits })}%`
}

function humanizeToken(value: string): string {
  return value
    .replace(/[_.-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase())
}

function normalizeRiskLevel(value: string | null | undefined): RiskLevel {
  const normalized = (value ?? '').toLowerCase()

  if (normalized === 'critical') return 'critical'
  if (['high', 'elevated', 'severe'].includes(normalized)) return 'high'
  if (['medium', 'moderate'].includes(normalized)) return 'medium'
  if (['low', 'minimal', 'stable', 'none'].includes(normalized)) return 'low'

  return 'unknown'
}

function toneFromRiskLevel(level: RiskLevel): InsightCardVM['tone'] {
  switch (level) {
    case 'critical':
      return 'critical'
    case 'high':
      return 'caution'
    case 'medium':
      return 'neutral'
    case 'low':
      return 'positive'
    default:
      return 'neutral'
  }
}

function riskLevelLabel(level: RiskLevel, locale?: string): string {
  return getReportingCopy(locale).riskLevels[level]
}

function normalizeTrendDirection(value: string | null | undefined): TrendDirection {
  const normalized = (value ?? '').toLowerCase()

  if (['stable', 'flat', 'steady', 'unchanged'].some((item) => normalized.includes(item))) {
    return 'stable'
  }

  if (['improv', 'recover', 'decreas', 'down'].some((item) => normalized.includes(item))) {
    return 'improving'
  }

  if (['wors', 'deterior', 'escalat', 'increase', 'up'].some((item) => normalized.includes(item))) {
    return 'worsening'
  }

  return 'unknown'
}

function toneFromTrend(direction: TrendDirection): InsightCardVM['tone'] {
  switch (direction) {
    case 'improving':
      return 'positive'
    case 'worsening':
      return 'critical'
    default:
      return 'neutral'
  }
}

function dedupeStrings(values: Array<string | null | undefined>): string[] {
  return Array.from(new Set(values.filter((value): value is string => typeof value === 'string' && value.length > 0)))
}

function mapProjectionConfidence(
  id: string,
  source: JsonObject | null,
  locale?: string,
  visibilityRules: VisibilityRule[] = ALWAYS
): ConfidenceBadgeVM {
  const level = normalizeConfidenceLevel(getString(source, 'level', 'confidence'))
  const score = getNumber(source, 'score', 'ratio', 'value') ?? confidenceLevelToScore(level)
  const badge = createConfidenceBadgeVM(id, score ?? level, locale, visibilityRules)
  const explanation = getString(source, 'explanation', 'reason')

  return explanation ? { ...badge, reason: explanation } : badge
}

function formatPrimitive(value: unknown): string | null {
  if (value == null) return null
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed || null
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  return null
}

function flattenDiagnostics(value: unknown, prefix = '', depth = 0): InsightFactVM[] {
  if (depth > 2) return []

  const primitive = formatPrimitive(value)
  if (primitive != null) {
    return prefix ? [{ label: humanizeToken(prefix), value: primitive }] : []
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      flattenDiagnostics(item, prefix ? `${prefix} ${index + 1}` : String(index + 1), depth + 1)
    )
  }

  const object = asObject(value)
  if (!object) return []

  return Object.entries(object).flatMap(([key, nested]) => {
    const nextPrefix = prefix ? `${prefix} ${key}` : key
    return flattenDiagnostics(nested, nextPrefix, depth + 1)
  })
}

function scaleRiskValue(value: number | null): number | null {
  if (value == null) return null
  return value <= 1 ? Number((value * 5).toFixed(2)) : value
}

function buildExplainability(
  summary: string,
  whyShown: string,
  reliability: string,
  recommendedAction: string,
  locale?: string
): RiskEventDetailVM['explainability'] {
  const copy = getReportingCopy(locale)

  return {
    whatHappened: summary || copy.common.noData,
    whyShown: whyShown || copy.common.noData,
    reliability: reliability || copy.common.notAvailable,
    recommendedAction: recommendedAction || copy.common.noData,
  }
}

function mapInsightToCard(
  source: JsonObject,
  id: string,
  locale?: string,
  updatedAt?: string | null,
  visibilityRules: VisibilityRule[] = ALWAYS
): InsightCardVM {
  const level = getString(source, 'confidence')
  const confidenceSource = getObject(source, 'confidence') ?? (level ? { level } : null)
  const confidence = confidenceSource
    ? mapProjectionConfidence(`${id}-confidence`, confidenceSource, locale, visibilityRules)
    : null
  const severity = normalizeRiskLevel(getString(source, 'severity', 'riskLevel'))
  const title = getString(source, 'title', 'category', 'label') ?? id
  const explanation = getString(source, 'explanation', 'text', 'summary') ?? getReportingCopy(locale).common.noData
  const contributingFactors = getStringArray(source, 'contributingFactors')
  const recommendedAction =
    dedupeStrings([getString(source, 'recommendedAction'), ...getStringArray(source, 'recommendedActions')])[0] ?? null

  return {
    id,
    title: humanizeToken(title),
    text: explanation,
    supportingText: contributingFactors.length > 0 ? contributingFactors.join(', ') : null,
    tone: severity === 'unknown' ? 'neutral' : toneFromRiskLevel(severity),
    presentation: 'textInsight',
    confidence,
    recommendedAction,
    updatedAt: updatedAt ?? null,
    visibilityRules,
  }
}

function createMetricCard(
  id: string,
  title: string,
  text: string,
  supportingText: string | null,
  tone: InsightCardVM['tone'],
  confidence: ConfidenceBadgeVM | null,
  updatedAt: string | null,
  visibilityRules: VisibilityRule[] = ALWAYS,
  presentation: InsightCardVM['presentation'] = 'badge'
): InsightCardVM {
  return {
    id,
    title,
    text,
    supportingText,
    tone,
    presentation,
    confidence,
    recommendedAction: null,
    updatedAt,
    visibilityRules,
  }
}

function mapReportOverviewProjectionToVM(source: unknown, locale?: string): ReportOverviewVM {
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

function mapRiskEventProjectionToVM(source: JsonObject, locale?: string, index = 0): RiskEventVM {
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

function mapMLInspectionProjectionToVM(
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

function mapPersonalRiskOverviewProjectionToVM(
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

function mapPersonalRiskTimelineProjectionToVM(
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

function riskIntensity(value: number | null, masked = false): TeamDynamicsVM['heatmap'][number]['intensity'] {
  if (masked) return 'masked'
  if (value == null) return 'low'
  if (value >= 3.5) return 'high'
  if (value >= 2) return 'medium'
  return 'low'
}

function mapTeamDynamicsProjectionToVM(
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

function buildRiskEventFallbackDetail(baseEvent: RiskEventVM): RiskEventDetailVM {
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

export async function getReportOverviewVM({ session, admin, locale }: DecisionSupportScope): Result<ReportOverviewVM> {
  const result = await requestProjection<unknown>(session, '/api/operational/v1/reports/overview', admin)

  if ('error' in result) {
    return result
  }

  return { data: mapReportOverviewProjectionToVM(result.data, locale) }
}

export async function getRiskEventsVM({ session, admin, locale }: DecisionSupportScope): Result<RiskEventVM[]> {
  const result = await requestProjection<unknown>(session, '/api/operational/v1/risk-events/feed', admin)

  if ('error' in result) {
    return result
  }

  const root = asObject(result.data)
  const items = Array.isArray(result.data) ? result.data : asArray(root?.items)
  return {
    data: items.flatMap((item, index) => {
      const event = asObject(item)
      return event ? [mapRiskEventProjectionToVM(event, locale, index)] : []
    }),
  }
}

export async function getRiskEventDetailVM(
  baseEvent: RiskEventVM,
  _scope: DecisionSupportScope
): Result<RiskEventDetailVM | null> {
  return { data: baseEvent.details ?? buildRiskEventFallbackDetail(baseEvent) }
}

export async function applyRiskEventAction(
  scope: DecisionSupportScope,
  eventId: string,
  dto: { actionType: RiskEventActionKind; note?: string }
): Result<{ success: boolean }> {
  return scope.admin
    ? applyDecisionSupportRiskEventActionAdmin(scope.session, scope.companyId, eventId, dto)
    : applyDecisionSupportRiskEventAction(scope.session, scope.companyId, eventId, dto)
}

export async function resolveRiskEvent(
  scope: DecisionSupportScope,
  eventId: string,
  dto: { note?: string }
): Result<{ success: boolean }> {
  return scope.admin
    ? resolveDecisionSupportRiskEventAdmin(scope.session, scope.companyId, eventId, dto)
    : resolveDecisionSupportRiskEvent(scope.session, scope.companyId, eventId, dto)
}

export async function getTeamDynamicsVM(
  session: CustomSession | null,
  _companyId: string,
  params: TeamDynamicsParams,
  locale?: string,
  admin?: boolean
): Result<TeamDynamicsVM> {
  const [overviewResult, timelineResult] = await Promise.all([
    requestProjection<unknown>(
      session,
      `/api/team/v1/overview${buildQuery({ groupId: params.groupId, from: params.from, to: params.to })}`,
      admin
    ),
    requestProjection<unknown>(
      session,
      `/api/team/v1/timeline${buildQuery({ groupId: params.groupId, from: params.from, to: params.to })}`,
      admin
    ),
  ])

  if ('error' in overviewResult) {
    return overviewResult
  }

  if ('error' in timelineResult) {
    return timelineResult
  }

  return { data: mapTeamDynamicsProjectionToVM(overviewResult.data, timelineResult.data, params.groupLabel, locale) }
}

export async function getMLInspectionVM(
  session: CustomSession | null,
  companyId: string,
  targetType: 'company' | 'team',
  targetId: string,
  locale?: string
): Result<MLInspectionVM> {
  const query = buildQuery({ target: targetType, targetId })
  const [operationalResult, diagnosticsResult, policyMetricsResult] = await Promise.all([
    requestProjection<unknown>(session, `/api/operational/v1/ml/inspection${query}`, true),
    requestProjection<unknown>(session, `/api/admin-diagnostics/v1/ml/inspection${query}`, true),
    requestProjection<unknown>(
      session,
      `/api/admin-diagnostics/v1/ml/policy-metrics${buildQuery({ companyId })}`,
      true
    ),
  ])

  if ('error' in operationalResult) {
    return operationalResult
  }

  if ('error' in diagnosticsResult) {
    return diagnosticsResult
  }

  if ('error' in policyMetricsResult) {
    return policyMetricsResult
  }

  return {
    data: mapMLInspectionProjectionToVM(
      operationalResult.data,
      diagnosticsResult.data,
      policyMetricsResult.data,
      targetType,
      targetId,
      locale
    ),
  }
}

export async function getAdminDiagnosticsInspectionVM(
  session: CustomSession | null,
  companyId: string,
  locale?: string
): Result<MLInspectionVM> {
  const result = await requestProjection<unknown>(
    session,
    `/api/admin-diagnostics/v1/ml/policy-metrics${buildQuery({ companyId })}`,
    true
  )

  if ('error' in result) {
    return result
  }

  return {
    data: mapMlInspectionToVM((result.data as PolicyMetrics | null) ?? null, [], 'company', companyId, locale),
  }
}

export async function getPersonalRiskOverviewVM(
  session: CustomSession | null,
  locale?: string
): Result<PersonalRiskOverviewVM> {
  const [overviewResult, insightsResult] = await Promise.all([
    requestProjection<unknown>(session, '/api/personal/v1/overview'),
    requestProjection<unknown>(session, '/api/personal/v1/insights'),
  ])

  if ('error' in overviewResult) {
    return overviewResult
  }

  if ('error' in insightsResult) {
    return insightsResult
  }

  return { data: mapPersonalRiskOverviewProjectionToVM(overviewResult.data, insightsResult.data, locale) }
}

export async function getPersonalRiskTimelineVM(
  session: CustomSession | null,
  period: '7d' | '14d' | '30d',
  locale?: string
): Result<PersonalRiskTimelineVM> {
  const result = await requestProjection<unknown>(session, `/api/personal/v1/timeline${buildQuery({ period })}`)

  if ('error' in result) {
    return result
  }

  return { data: mapPersonalRiskTimelineProjectionToVM(result.data, period, locale) }
}

export async function getPersonalRiskDashboardVM(
  session: CustomSession | null,
  locale?: string
): Result<{
  overview: PersonalRiskOverviewVM
  timelines: Record<'7d' | '14d' | '30d', PersonalRiskTimelineVM>
}> {
  const [overviewResult, insightsResult, timeline7dResult, timeline14dResult, timeline30dResult] = await Promise.all([
    requestProjection<unknown>(session, '/api/personal/v1/overview'),
    requestProjection<unknown>(session, '/api/personal/v1/insights'),
    requestProjection<unknown>(session, '/api/personal/v1/timeline?period=7d'),
    requestProjection<unknown>(session, '/api/personal/v1/timeline?period=14d'),
    requestProjection<unknown>(session, '/api/personal/v1/timeline?period=30d'),
  ])

  if ('error' in overviewResult) {
    return overviewResult
  }

  if ('error' in insightsResult) {
    return insightsResult
  }

  if ('error' in timeline7dResult) {
    return timeline7dResult
  }

  if ('error' in timeline14dResult) {
    return timeline14dResult
  }

  if ('error' in timeline30dResult) {
    return timeline30dResult
  }

  return {
    data: {
      overview: mapPersonalRiskOverviewProjectionToVM(overviewResult.data, insightsResult.data, locale),
      timelines: {
        '7d': mapPersonalRiskTimelineProjectionToVM(timeline7dResult.data, '7d', locale),
        '14d': mapPersonalRiskTimelineProjectionToVM(timeline14dResult.data, '14d', locale),
        '30d': mapPersonalRiskTimelineProjectionToVM(timeline30dResult.data, '30d', locale),
      },
    },
  }
}
