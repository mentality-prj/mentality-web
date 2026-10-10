import { normalizeDecisionSupportConfidence, toDecisionSupportLocale } from '@/helpers/decisionSupport.helpers'
import { getReportingCopy } from '@/helpers/reportingCopy'
import { AnalyticsResponse, AnalyticsTrendPoint } from '@/types/company'
import {
  DecisionSupportAction,
  DecisionSupportReport,
  DecisionSupportRiskEvent,
  PolicyAuditEntry,
  PolicyMetrics,
  RiskAssociationEvidenceEntity,
  RiskEventOutcome,
} from '@/types/decisionSupport'
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
  TrendPointVM,
  VisibilityRule,
} from '@/types/reporting'
import { MoodStatistics, PsyTestsStatistics } from '@/types/userStatistics'

const ALWAYS: VisibilityRule[] = ['always']
const AGGREGATE_ONLY: VisibilityRule[] = ['aggregate-only']
const DIAGNOSTICS_ONLY: VisibilityRule[] = ['admin-only', 'diagnostics-only']

function formatNumber(value: number | null | undefined, locale?: string, maximumFractionDigits = 0): string {
  if (value == null || !Number.isFinite(value)) {
    return getReportingCopy(locale).common.notAvailable
  }

  return new Intl.NumberFormat(toDecisionSupportLocale(locale), { maximumFractionDigits }).format(value)
}

function formatCurrency(value: number | null | undefined, locale?: string): string {
  if (value == null || !Number.isFinite(value)) {
    return getReportingCopy(locale).common.notAvailable
  }

  return new Intl.NumberFormat(toDecisionSupportLocale(locale), {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercent(value: number | null | undefined, locale?: string): string {
  if (value == null || !Number.isFinite(value)) {
    return getReportingCopy(locale).common.notAvailable
  }

  return new Intl.NumberFormat(toDecisionSupportLocale(locale), {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(value > 1 ? value / 100 : value)
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

function normalizeRiskLevel(value: string | null | undefined): RiskLevel {
  switch (value?.toLowerCase()) {
    case 'critical':
      return 'critical'
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

function normalizeConfidenceLevel(score: number | string | null | undefined): ConfidenceLevel {
  const normalized = normalizeDecisionSupportConfidence(score ?? null)
  if (normalized == null) return 'unknown'
  if (normalized >= 0.75) return 'high'
  if (normalized >= 0.4) return 'medium'
  return 'low'
}

export function createConfidenceBadgeVM(
  id: string,
  score: number | string | null | undefined,
  locale?: string,
  visibilityRules: VisibilityRule[] = ALWAYS
): ConfidenceBadgeVM {
  const copy = getReportingCopy(locale)
  const normalized = normalizeDecisionSupportConfidence(score ?? null)
  const level = normalizeConfidenceLevel(score)

  return {
    id,
    level,
    label: copy.confidence.levels[level],
    score: normalized,
    reason: copy.confidence.reasons[level],
    improveQualityHint: copy.confidence.improvements[level],
    visibilityRules,
  }
}

function fallbackSummary(event: DecisionSupportRiskEvent): string {
  return event.explanationShort ?? event.shortExplanation ?? event.explanation ?? event.title
}

function formatStatusLabel(status: string | null | undefined, locale?: string): string {
  const copy = getReportingCopy(locale)
  return copy.riskStatuses[status?.toLowerCase() ?? 'unknown'] ?? status ?? copy.common.notAvailable
}

function formatRiskLevelLabel(level: RiskLevel, locale?: string): string {
  return getReportingCopy(locale).riskLevels[level]
}

function getRecommendedActionKinds(level: RiskLevel, status: string | null | undefined): RiskEventActionKind[] {
  if (level === 'critical' || status === 'escalating') {
    return ['reduce_workload', 'team_sync']
  }

  if (level === 'high') {
    return ['one_on_one_meeting', 'reduce_workload']
  }

  if (level === 'medium') {
    return ['one_on_one_meeting']
  }

  return ['team_sync']
}

function actionLabels(kinds: RiskEventActionKind[], locale?: string): string[] {
  const copy = getReportingCopy(locale)
  return kinds.map((kind) => copy.actions[kind])
}

function buildRiskExplainability(
  summary: string,
  severity: RiskLevel,
  status: string | null | undefined,
  confidence: ConfidenceBadgeVM,
  locale?: string
) {
  const copy = getReportingCopy(locale)
  const actionText = actionLabels(getRecommendedActionKinds(severity, status), locale)[0] ?? copy.common.notAvailable

  return {
    whatHappened: summary,
    whyShown: `${formatRiskLevelLabel(severity, locale)} · ${formatStatusLabel(status, locale)}`,
    reliability: `${confidence.label}. ${confidence.reason}`,
    recommendedAction: actionText,
  }
}

function mapActionToInsight(action: DecisionSupportAction, locale?: string): InsightCardVM {
  const confidence = createConfidenceBadgeVM(`action-${action.id}`, action.confidence, locale)

  return {
    id: action.id,
    title: action.title,
    text: action.description,
    supportingText: action.targetId ?? action.target ?? null,
    tone: toneFromRiskLevel(normalizeRiskLevel(action.severity)),
    presentation: 'textInsight',
    confidence,
    recommendedAction: action.title,
    updatedAt: null,
    visibilityRules: ALWAYS,
  }
}

function mapTeamRankingItem(item: DecisionSupportReport['teamRanking'][number], locale?: string): ReportRankingItemVM {
  return {
    id: item.groupId,
    label: item.groupName,
    rank: item.rank,
    valueLabel:
      item.riskScore == null ? getReportingCopy(locale).common.notAvailable : formatPercent(item.riskScore, locale),
    supportingText: null,
    visibilityRules: AGGREGATE_ONLY,
  }
}

export function mapDecisionSupportReportToVM(report: DecisionSupportReport, locale?: string): ReportOverviewVM {
  const copy = getReportingCopy(locale)
  const executiveConfidence = createConfidenceBadgeVM('executive-summary', report.executiveSummary?.confidence, locale)
  const interpretationGuidance = [
    report.analyticsGuard?.interpretationGuidance,
    ...(report.analyticsGuard?.reasonCodes ?? []).map((code) => copy.guardReasons[code] ?? code),
  ].filter((value): value is string => Boolean(value))

  const signalsSummary: InsightCardVM[] = report.groupBurnouts.slice(0, 3).map((item) => ({
    id: `signal-${item.groupId}`,
    title: item.groupName,
    text:
      item.burnoutRisk == null
        ? copy.common.notAvailable
        : `${copy.reportOverview.topTeam}: ${formatPercent(item.burnoutRisk, locale)}`,
    supportingText: null,
    tone: toneFromRiskLevel(
      normalizeRiskLevel(item.burnoutRisk != null && item.burnoutRisk > 0.66 ? 'high' : 'medium')
    ),
    presentation: 'badge',
    confidence: executiveConfidence,
    recommendedAction: null,
    updatedAt: null,
    visibilityRules: AGGREGATE_ONLY,
  }))

  if (interpretationGuidance.length > 0) {
    signalsSummary.push({
      id: 'signal-guard',
      title: copy.reportOverview.interpretationGuidance,
      text: interpretationGuidance[0],
      supportingText: interpretationGuidance[1] ?? null,
      tone: 'caution',
      presentation: 'textInsight',
      confidence: null,
      recommendedAction: null,
      updatedAt: null,
      visibilityRules: ALWAYS,
    })
  }

  const companyHealthSummary: InsightCardVM[] = [
    {
      id: 'health-total-risk',
      title: copy.reportOverview.totalEstimatedRisk,
      text: formatCurrency(report.companyImpact?.totalEstimatedRiskEur, locale),
      supportingText: null,
      tone: 'caution',
      presentation: 'textInsight',
      confidence: executiveConfidence,
      recommendedAction: null,
      updatedAt: null,
      visibilityRules: AGGREGATE_ONLY,
    },
    {
      id: 'health-attrition',
      title: copy.reportOverview.attritionCost,
      text: formatCurrency(report.companyImpact?.estimatedAttritionCostEur, locale),
      supportingText: null,
      tone: 'critical',
      presentation: 'textInsight',
      confidence: executiveConfidence,
      recommendedAction: null,
      updatedAt: null,
      visibilityRules: AGGREGATE_ONLY,
    },
    {
      id: 'health-productivity',
      title: copy.reportOverview.productivityLoss,
      text: formatCurrency(report.companyImpact?.estimatedProductivityLossEur, locale),
      supportingText: null,
      tone: 'neutral',
      presentation: 'textInsight',
      confidence: executiveConfidence,
      recommendedAction: null,
      updatedAt: null,
      visibilityRules: AGGREGATE_ONLY,
    },
  ]

  const actionsList = report.actions.map((action) => mapActionToInsight(action, locale))
  const confidenceStrip = [
    executiveConfidence,
    ...report.actions
      .slice(0, 3)
      .map((action) => createConfidenceBadgeVM(`action-confidence-${action.id}`, action.confidence, locale)),
  ]

  return {
    id: 'report-overview',
    companyHealthSummary,
    actionsList,
    teamRanking: report.teamRanking.map((item) => mapTeamRankingItem(item, locale)),
    signalsSummary,
    interpretationGuidance,
    executiveSummary: report.executiveSummary
      ? {
          id: 'executive-summary-card',
          title: copy.reportOverview.executiveSummary,
          text: report.executiveSummary.headline ?? copy.common.notAvailable,
          supportingText:
            report.executiveSummary.risks[0] ?? report.executiveSummary.recommendations[0] ?? copy.common.noData,
          tone: toneFromRiskLevel(normalizeRiskLevel(report.executiveSummary.overallStatus)),
          presentation: 'textInsight',
          confidence: executiveConfidence,
          recommendedAction: report.executiveSummary.recommendations[0] ?? null,
          updatedAt: null,
          visibilityRules: ALWAYS,
        }
      : null,
    confidenceStrip,
    updatedAt: null,
    hiddenFieldKeys: report.changeTracking ? ['changeTracking'] : [],
    visibilityRules: ALWAYS,
  }
}

function buildRiskEventFinancialRange(event: DecisionSupportRiskEvent, locale?: string): string | null {
  if (event.financialImpactRange) {
    return event.financialImpactRange
  }

  const min = typeof event.financialImpactMinEur === 'number' ? event.financialImpactMinEur : null
  const max = typeof event.financialImpactMaxEur === 'number' ? event.financialImpactMaxEur : null

  if (min != null && max != null) {
    return `${formatCurrency(min, locale)} - ${formatCurrency(max, locale)}`
  }

  if (typeof event.estimatedImpactEur === 'number') {
    return formatCurrency(event.estimatedImpactEur, locale)
  }

  return null
}

export function mapDecisionSupportRiskEventToVM(event: DecisionSupportRiskEvent, locale?: string): RiskEventVM {
  const severity = normalizeRiskLevel(event.severity)
  const confidence = createConfidenceBadgeVM(`risk-event-${event.id}`, event.confidence, locale)
  const summary = fallbackSummary(event)
  const recommendedKinds = getRecommendedActionKinds(severity, event.status)

  return {
    id: event.id,
    title: event.title,
    severity,
    status: event.status,
    confidence,
    summary,
    financialRange: buildRiskEventFinancialRange(event, locale),
    lastSeenAt: event.lastSeenAt,
    explainability: buildRiskExplainability(summary, severity, event.status, confidence, locale),
    recommendedActions: actionLabels(recommendedKinds, locale),
    details: null,
    visibilityRules: ALWAYS,
  }
}

function sanitizeTextList(list: Array<string | Record<string, unknown>> | undefined): string[] {
  if (!Array.isArray(list)) return []

  return list
    .map((item) => {
      if (typeof item === 'string') {
        return item.trim()
      }

      const values = Object.values(item)
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
        .map((value) => value.trim())

      return values.join(' · ')
    })
    .filter((item) => item.length > 0)
}

function buildEvidenceDiagnostics(evidence: RiskAssociationEvidenceEntity | null, locale?: string): InsightFactVM[] {
  if (!evidence) return []
  const copy = getReportingCopy(locale)

  return [
    { label: copy.riskFeed.sampleSize, value: formatNumber(evidence.effectiveN, locale) },
    { label: copy.riskFeed.dataCoverage, value: formatPercent(evidence.dataCoverageScore, locale) },
    { label: copy.riskFeed.evidenceStrength, value: evidence.evidenceStrength },
  ]
}

export function mapRiskEventDetailToVM(
  baseEvent: RiskEventVM,
  outcome: RiskEventOutcome | null,
  evidence: RiskAssociationEvidenceEntity | null,
  locale?: string
): RiskEventDetailVM {
  const history = sanitizeTextList(outcome?.history as Array<string | Record<string, unknown>> | undefined)
  const performedActions = sanitizeTextList(outcome?.actions as Array<string | Record<string, unknown>> | undefined)
  const diagnostics = buildEvidenceDiagnostics(evidence, locale)
  const copy = getReportingCopy(locale)

  return {
    status: outcome?.status ?? baseEvent.status,
    effectSizeLabel: outcome?.effectSize == null ? null : formatPercent(Number(outcome.effectSize), locale),
    history,
    performedActions,
    outcome: outcome?.outcome ?? null,
    explainability: {
      whatHappened: baseEvent.explainability.whatHappened,
      whyShown: evidence?.summary ?? baseEvent.explainability.whyShown,
      reliability:
        diagnostics.length > 0
          ? `${baseEvent.confidence.label}. ${diagnostics.map((item) => `${item.label}: ${item.value}`).join(' · ')}`
          : baseEvent.explainability.reliability,
      recommendedAction: baseEvent.recommendedActions[0] ?? copy.common.notAvailable,
    },
    recommendedActions: baseEvent.recommendedActions,
    diagnostics,
  }
}

function buildInspectionCard(
  id: string,
  title: string,
  text: string,
  tone: InsightCardVM['tone'],
  locale?: string
): InsightCardVM {
  return {
    id,
    title,
    text,
    supportingText: null,
    tone,
    presentation: 'badge',
    confidence: null,
    recommendedAction: null,
    updatedAt: null,
    visibilityRules: DIAGNOSTICS_ONLY,
  }
}

export function mapMlInspectionToVM(
  metrics: PolicyMetrics | null,
  audit: PolicyAuditEntry[],
  targetType: 'company' | 'team',
  targetId: string,
  locale?: string
): MLInspectionVM {
  const copy = getReportingCopy(locale)
  const total = metrics?.totalRiskEvents ?? 0
  const activeRate = total > 0 ? (metrics?.activeCount ?? 0) / total : null
  const escalatingRate = total > 0 ? (metrics?.escalatingCount ?? 0) / total : null
  const confidence = createConfidenceBadgeVM(
    'ml-inspection-confidence',
    metrics?.averageConfidence ?? null,
    locale,
    DIAGNOSTICS_ONLY
  )
  const diagnostics: InsightFactVM[] = []

  if (metrics?.totalRiskEvents != null) {
    diagnostics.push({ label: copy.diagnostics.totalEvents, value: formatNumber(metrics.totalRiskEvents, locale) })
  }

  if (metrics?.activeCount != null) {
    diagnostics.push({ label: copy.riskStatuses.active, value: formatNumber(metrics.activeCount, locale) })
  }

  if (metrics?.resolvedCount != null) {
    diagnostics.push({ label: copy.riskStatuses.resolved, value: formatNumber(metrics.resolvedCount, locale) })
  }

  if (metrics?.escalatingCount != null) {
    diagnostics.push({ label: copy.riskStatuses.escalating, value: formatNumber(metrics.escalatingCount, locale) })
  }

  if (metrics?.suppressedCount != null) {
    diagnostics.push({ label: copy.riskStatuses.suppressed, value: formatNumber(metrics.suppressedCount, locale) })
  }

  if (metrics?.averageConfidence != null) {
    diagnostics.push({ label: copy.diagnostics.modelTrust, value: confidence.label })
  }

  return {
    targetType,
    targetId,
    cards: {
      riskScore: buildInspectionCard(
        'inspection-risk-score',
        copy.diagnostics.riskScore,
        activeRate == null ? copy.common.notAvailable : formatPercent(activeRate, locale),
        activeRate != null && activeRate >= 0.5 ? 'critical' : 'neutral',
        locale
      ),
      anomaly: buildInspectionCard(
        'inspection-anomaly',
        copy.diagnostics.anomaly,
        escalatingRate == null ? copy.common.notAvailable : formatPercent(escalatingRate, locale),
        escalatingRate != null && escalatingRate >= 0.2 ? 'caution' : 'neutral',
        locale
      ),
      probability: buildInspectionCard(
        'inspection-probability',
        copy.diagnostics.probability,
        metrics?.averageConfidence == null
          ? copy.common.notAvailable
          : formatPercent(metrics.averageConfidence, locale),
        'neutral',
        locale
      ),
      modelVersion: buildInspectionCard(
        'inspection-model-version',
        copy.diagnostics.modelVersion,
        copy.common.notAvailable,
        'neutral',
        locale
      ),
    },
    details: audit.slice(0, 5).map((entry, index) => ({
      id: `audit-${entry.id ?? index}`,
      title: entry.action ?? copy.common.notAvailable,
      text: entry.performedBy ?? copy.common.notAvailable,
      supportingText: entry.performedAt ?? null,
      tone: 'neutral',
      presentation: 'textInsight',
      confidence: null,
      recommendedAction: null,
      updatedAt: entry.performedAt ?? null,
      visibilityRules: DIAGNOSTICS_ONLY,
    })),
    diagnostics,
    confidence,
    visibilityRules: DIAGNOSTICS_ONLY,
  }
}

function calculateRiskIndex(
  mood: number | null | undefined,
  stress: number | null | undefined,
  energy: number | null | undefined,
  focus: number | null | undefined
): number | null {
  const signals = [
    typeof stress === 'number' ? stress : null,
    typeof mood === 'number' ? 6 - mood : null,
    typeof energy === 'number' ? 6 - energy : null,
    typeof focus === 'number' ? 6 - focus : null,
  ].filter((value): value is number => value != null)

  if (signals.length === 0) {
    return null
  }

  return signals.reduce((sum, value) => sum + value, 0) / signals.length
}

function calculateTrendDirection(first: number | null, last: number | null): TrendDirection {
  if (first == null || last == null) return 'unknown'
  const delta = last - first
  if (delta >= 0.2) return 'worsening'
  if (delta <= -0.2) return 'improving'
  return 'stable'
}

function buildTrendPoints(trend: AnalyticsTrendPoint[], locale?: string): TrendPointVM[] {
  const values = trend.map((point) =>
    calculateRiskIndex(point.avgMood, point.avgStress, point.avgEnergy, point.avgFocus)
  )
  const baseline = values.filter((value): value is number => value != null)
  const baselineValue = baseline.length > 0 ? baseline.reduce((sum, value) => sum + value, 0) / baseline.length : null

  return trend.map((point, index) => ({
    label: point.period,
    value: values[index],
    baseline: baselineValue,
    confidence: point.checkins > 0 ? Math.min(point.checkins / 20, 1) : 0,
  }))
}

function dominantIntensity(highShare: number): 'low' | 'medium' | 'high' {
  if (highShare >= 0.35) return 'high'
  if (highShare >= 0.15) return 'medium'
  return 'low'
}

export function mapAnalyticsToTeamDynamicsVM(analytics: AnalyticsResponse, locale?: string): TeamDynamicsVM {
  const copy = getReportingCopy(locale)
  const trendPoints = buildTrendPoints(analytics.trend, locale)
  const first = trendPoints[0]?.value ?? null
  const last = trendPoints[trendPoints.length - 1]?.value ?? null
  const highRiskShare =
    analytics.totalEmployees > 0 ? (analytics.riskDistribution?.high ?? 0) / analytics.totalEmployees : 0
  const confidence = createConfidenceBadgeVM(
    'team-dynamics-confidence',
    analytics.totalEmployees > 0 ? analytics.totalCheckins / (analytics.totalEmployees * 7) : null,
    locale,
    AGGREGATE_ONLY
  )

  const topGroup = analytics.groups
    .slice()
    .sort((a, b) => (b.riskDistribution?.high ?? 0) - (a.riskDistribution?.high ?? 0))[0]

  return {
    aggregateTrend: {
      title: copy.teamDynamics.aggregateTrend,
      points: trendPoints,
    },
    propagationRisk: {
      id: 'team-propagation-risk',
      title: copy.teamDynamics.propagationRisk,
      text: formatPercent(highRiskShare, locale),
      supportingText: topGroup ? `${copy.reportOverview.topTeam}: ${topGroup.groupName}` : null,
      tone: dominantIntensity(highRiskShare) === 'high' ? 'critical' : highRiskShare > 0.15 ? 'caution' : 'positive',
      presentation: 'badge',
      confidence,
      recommendedAction: copy.actions.team_sync,
      updatedAt: null,
      visibilityRules: AGGREGATE_ONLY,
    },
    synchronizedDeterioration: {
      id: 'team-sync-deterioration',
      title: copy.teamDynamics.synchronizedDeterioration,
      text:
        calculateTrendDirection(first, last) === 'worsening'
          ? copy.personalRisk.patternUnstable
          : copy.personalRisk.stablePattern,
      supportingText: analytics.privacy.isMasked ? copy.teamDynamics.masked : null,
      tone: calculateTrendDirection(first, last) === 'worsening' ? 'critical' : 'positive',
      presentation: 'badge',
      confidence,
      recommendedAction: copy.actions.team_sync,
      updatedAt: null,
      visibilityRules: AGGREGATE_ONLY,
    },
    confidence,
    insightCards: [
      {
        id: 'team-insight-top-group',
        title: copy.teamDynamics.insightCards,
        text: topGroup
          ? `${topGroup.groupName}: ${formatNumber(topGroup.riskDistribution?.high ?? 0, locale)}`
          : copy.common.noData,
        supportingText: analytics.privacy.isMasked ? copy.teamDynamics.masked : null,
        tone: topGroup && (topGroup.riskDistribution?.high ?? 0) > 0 ? 'caution' : 'neutral',
        presentation: 'textInsight',
        confidence,
        recommendedAction: copy.actions.team_sync,
        updatedAt: null,
        visibilityRules: AGGREGATE_ONLY,
      },
    ],
    heatmap: analytics.groups.map((group) => {
      const total = group.totalEmployees || 1
      const share = (group.riskDistribution?.high ?? 0) / total
      return {
        id: group.groupId,
        label: group.groupName,
        intensity: analytics.privacy.isMasked ? 'masked' : dominantIntensity(share),
        aggregateLabel: analytics.privacy.isMasked
          ? copy.teamDynamics.masked
          : `${formatNumber(group.riskDistribution?.high ?? 0, locale)} / ${formatNumber(group.totalEmployees, locale)}`,
        visibilityRules: AGGREGATE_ONLY,
      }
    }),
    trendDetail: {
      keyChanges: [
        `${copy.teamDynamics.keyChanges}: ${calculateTrendDirection(first, last)}`,
        `${copy.teamDynamics.privacyState}: ${analytics.privacy.isMasked ? copy.teamDynamics.masked : 'Visible'}`,
      ],
      recommendedInterventions: [copy.actions.team_sync, copy.actions.reduce_workload],
      privacyState: analytics.privacy.isMasked ? copy.teamDynamics.masked : 'Visible',
    },
    visibilityRules: AGGREGATE_ONLY,
  }
}

function calculateVolatility(values: number[]): number {
  if (values.length < 2) return 0
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length
  return Math.sqrt(variance)
}

function extractPsySignal(psyTests: PsyTestsStatistics | null): number {
  if (!psyTests) return 0

  const normalizedScores = [
    psyTests.k10.latest ? psyTests.k10.latest.score / 40 : null,
    psyTests.phq9.latest ? psyTests.phq9.latest.score / 27 : null,
    psyTests.gad7.latest ? psyTests.gad7.latest.score / 21 : null,
  ].filter((value): value is number => value != null)

  if (normalizedScores.length === 0) return 0
  return normalizedScores.reduce((sum, value) => sum + value, 0) / normalizedScores.length
}

function buildPersonalInsightCards(
  mood: MoodStatistics,
  locale?: string,
  overallConfidence?: ConfidenceBadgeVM | null
): InsightCardVM[] {
  const copy = getReportingCopy(locale)
  const trendValues = mood.trend30d
    .map((point) => calculateRiskIndex(point.mood, point.stress, point.energy, point.focus))
    .filter((value): value is number => value != null)

  const volatility = calculateVolatility(trendValues)
  const allTimeRisk = calculateRiskIndex(
    mood.allTime.mood,
    mood.allTime.stress,
    mood.allTime.energy,
    mood.allTime.focus
  )
  const last7Risk = mood.last7d
    ? calculateRiskIndex(mood.last7d.mood, mood.last7d.stress, mood.last7d.energy, mood.last7d.focus)
    : null
  const energyDelta = mood.last7d && mood.last30d ? mood.last7d.energy - mood.last30d.energy : 0

  const candidates: Array<{
    id: string
    title: string
    text: string
    tone: InsightCardVM['tone']
  }> = []

  if (last7Risk != null && allTimeRisk != null && last7Risk - allTimeRisk >= 0.35) {
    candidates.push({
      id: 'tension-baseline',
      title: copy.personalRisk.baselineShiftTitle,
      text: copy.personalRisk.tensionAboveBaseline,
      tone: 'caution',
    })
  }

  if (energyDelta <= -0.25) {
    candidates.push({
      id: 'recovery-slowed',
      title: copy.personalRisk.recoveryStateTitle,
      text: copy.personalRisk.recoverySlowed,
      tone: 'critical',
    })
  }

  if (volatility >= 0.35) {
    candidates.push({
      id: 'pattern-unstable',
      title: copy.personalRisk.patternStateTitle,
      text: copy.personalRisk.patternUnstable,
      tone: 'caution',
    })
  }

  if (candidates.length === 0) {
    candidates.push({
      id: 'pattern-stable',
      title: copy.personalRisk.patternStateTitle,
      text: copy.personalRisk.stablePattern,
      tone: 'positive',
    })
  }

  return candidates.slice(0, 3).map((candidate) => ({
    id: candidate.id,
    title: candidate.title,
    text: candidate.text,
    supportingText: null,
    tone: candidate.tone,
    presentation: 'textInsight',
    confidence: overallConfidence ?? null,
    recommendedAction: null,
    updatedAt: mood.trend30d[mood.trend30d.length - 1]?.date ?? null,
    visibilityRules: ALWAYS,
  }))
}

function derivePersonalRiskScore(mood: MoodStatistics, psyTests: PsyTestsStatistics | null): number | null {
  const baseRisk = mood.last7d
    ? calculateRiskIndex(mood.last7d.mood, mood.last7d.stress, mood.last7d.energy, mood.last7d.focus)
    : calculateRiskIndex(mood.allTime.mood, mood.allTime.stress, mood.allTime.energy, mood.allTime.focus)

  if (baseRisk == null) return null

  const normalizedBase = (baseRisk - 1) / 4
  const psySignal = extractPsySignal(psyTests)
  return Math.min(1, Math.max(0, normalizedBase * 0.75 + psySignal * 0.25))
}

function riskScoreToLevel(score: number | null): RiskLevel {
  if (score == null) return 'unknown'
  if (score >= 0.7) return 'high'
  if (score >= 0.45) return 'medium'
  return 'low'
}

function buildPersonalWhySeeingThis(mood: MoodStatistics, insights: InsightCardVM[], locale?: string) {
  const copy = getReportingCopy(locale)
  const completeness =
    mood.trend30d.length >= 21
      ? copy.confidence.levels.high
      : mood.trend30d.length >= 10
        ? copy.confidence.levels.medium
        : copy.confidence.levels.low

  return {
    recentChanges: insights.map((item) => item.text),
    contributingFactors: mood.topTags.slice(0, 3).map((tag) => tag.tag),
    dataCompleteness: `${completeness} · ${formatNumber(mood.totalRecords, locale)}`,
    explanationText: insights.length > 0 ? copy.personalRisk.explanationSummary : copy.common.noData,
  }
}

export function mapMoodStatisticsToPersonalRiskOverview(
  mood: MoodStatistics,
  psyTests: PsyTestsStatistics | null,
  locale?: string
): PersonalRiskOverviewVM {
  const copy = getReportingCopy(locale)
  const score = derivePersonalRiskScore(mood, psyTests)
  const level = riskScoreToLevel(score)
  const confidence = createConfidenceBadgeVM(
    'personal-risk-confidence',
    mood.trend30d.length > 0 ? mood.trend30d.length / 30 : null,
    locale
  )
  const insights = buildPersonalInsightCards(mood, locale, confidence)
  const allTimeRisk = calculateRiskIndex(
    mood.allTime.mood,
    mood.allTime.stress,
    mood.allTime.energy,
    mood.allTime.focus
  )
  const last7Risk = mood.last7d
    ? calculateRiskIndex(mood.last7d.mood, mood.last7d.stress, mood.last7d.energy, mood.last7d.focus)
    : null
  const trendDirection = calculateTrendDirection(
    calculateRiskIndex(mood.last30d?.mood, mood.last30d?.stress, mood.last30d?.energy, mood.last30d?.focus),
    last7Risk
  )
  const deviation =
    allTimeRisk != null && last7Risk != null
      ? `${last7Risk >= allTimeRisk ? '+' : ''}${(last7Risk - allTimeRisk).toFixed(2)}`
      : copy.common.notAvailable

  return {
    currentRiskLevel: {
      id: 'personal-current-risk',
      title: copy.personalRisk.currentRisk,
      text: formatRiskLevelLabel(level, locale),
      supportingText: score == null ? null : formatPercent(score, locale),
      tone: toneFromRiskLevel(level),
      presentation: 'badge',
      confidence,
      recommendedAction: null,
      updatedAt: mood.trend30d[mood.trend30d.length - 1]?.date ?? null,
      visibilityRules: ALWAYS,
    },
    deviationFromBaseline: {
      id: 'personal-baseline-deviation',
      title: copy.personalRisk.deviationFromBaseline,
      text: insights[0]?.title ?? copy.personalRisk.stablePattern,
      supportingText: deviation,
      tone: insights[0]?.tone ?? 'neutral',
      presentation: 'textInsight',
      confidence,
      recommendedAction: null,
      updatedAt: mood.trend30d[mood.trend30d.length - 1]?.date ?? null,
      visibilityRules: ALWAYS,
    },
    confidence,
    recentTrend: {
      id: 'personal-recent-trend',
      title: copy.personalRisk.recentTrend,
      text: trendDirection,
      supportingText: mood.trend30d[mood.trend30d.length - 1]?.date ?? null,
      tone: trendDirection === 'worsening' ? 'critical' : trendDirection === 'improving' ? 'positive' : 'neutral',
      presentation: 'chart',
      confidence,
      recommendedAction: null,
      updatedAt: mood.trend30d[mood.trend30d.length - 1]?.date ?? null,
      visibilityRules: ALWAYS,
    },
    topInsights: insights,
    updatedAt: mood.trend30d[mood.trend30d.length - 1]?.date ?? null,
    whySeeingThis: buildPersonalWhySeeingThis(mood, insights, locale),
    visibilityRules: ALWAYS,
  }
}

function selectMoodRange(mood: MoodStatistics, period: '7d' | '14d' | '30d') {
  const length = period === '7d' ? 7 : period === '14d' ? 14 : 30
  return mood.trend30d.slice(-length)
}

export function mapMoodStatisticsToPersonalRiskTimeline(
  mood: MoodStatistics,
  psyTests: PsyTestsStatistics | null,
  period: '7d' | '14d' | '30d',
  locale?: string
): PersonalRiskTimelineVM {
  const copy = getReportingCopy(locale)
  const selected = selectMoodRange(mood, period)
  const points = selected.map((point) => ({
    label: point.date,
    value: calculateRiskIndex(point.mood, point.stress, point.energy, point.focus),
    baseline: calculateRiskIndex(mood.allTime.mood, mood.allTime.stress, mood.allTime.energy, mood.allTime.focus),
    confidence: Math.min(selected.length / (period === '30d' ? 30 : period === '14d' ? 14 : 7), 1),
  }))
  const confidence = createConfidenceBadgeVM(
    `personal-risk-timeline-${period}`,
    selected.length / (period === '30d' ? 30 : period === '14d' ? 14 : 7),
    locale
  )
  const trendDirection = calculateTrendDirection(points[0]?.value ?? null, points[points.length - 1]?.value ?? null)
  const overview = mapMoodStatisticsToPersonalRiskOverview(mood, psyTests, locale)

  return {
    period,
    trendDirection,
    confidence,
    points,
    baselineReferenceLabel: copy.personalRisk.baselineReference,
    explanationCards: overview.topInsights,
    whySeeingThis: overview.whySeeingThis,
    visibilityRules: ALWAYS,
  }
}
