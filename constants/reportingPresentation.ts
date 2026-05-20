import { PresentationFieldPolicy } from '@/types/reporting'

type PresentationPolicyMap = Record<string, readonly PresentationFieldPolicy[]>

export const REPORTING_PRESENTATION_POLICY: PresentationPolicyMap = Object.freeze({
  reportOverview: [
    { field: 'companyHealthSummary', kind: 'textInsight', visibility: 'always' },
    { field: 'actionsList', kind: 'textInsight', visibility: 'always' },
    { field: 'teamRanking', kind: 'chart', visibility: 'aggregate-only' },
    { field: 'signalsSummary', kind: 'badge', visibility: 'always' },
    { field: 'interpretationGuidance', kind: 'textInsight', visibility: 'always' },
    { field: 'executiveSummary', kind: 'textInsight', visibility: 'always' },
    { field: 'confidenceStrip', kind: 'badge', visibility: 'always' },
  ],
  riskEvent: [
    { field: 'summary', kind: 'textInsight', visibility: 'always' },
    { field: 'severity', kind: 'badge', visibility: 'always' },
    { field: 'status', kind: 'badge', visibility: 'always' },
    { field: 'confidence', kind: 'badge', visibility: 'always' },
    { field: 'details.history', kind: 'textInsight', visibility: 'always' },
    { field: 'details.diagnostics', kind: 'hidden', visibility: 'diagnostics-only' },
  ],
  mlInspection: [
    { field: 'cards.riskScore', kind: 'badge', visibility: 'admin-only' },
    { field: 'cards.anomaly', kind: 'badge', visibility: 'admin-only' },
    { field: 'cards.probability', kind: 'badge', visibility: 'admin-only' },
    { field: 'cards.modelVersion', kind: 'badge', visibility: 'admin-only' },
    { field: 'details', kind: 'textInsight', visibility: 'admin-only' },
    { field: 'diagnostics', kind: 'hidden', visibility: 'diagnostics-only' },
  ],
  personalRiskOverview: [
    { field: 'currentRiskLevel', kind: 'badge', visibility: 'always' },
    { field: 'deviationFromBaseline', kind: 'textInsight', visibility: 'always' },
    { field: 'confidence', kind: 'badge', visibility: 'always' },
    { field: 'recentTrend', kind: 'chart', visibility: 'always' },
    { field: 'topInsights', kind: 'textInsight', visibility: 'always' },
    { field: 'whySeeingThis', kind: 'textInsight', visibility: 'always' },
    { field: 'feasibleStateSpace', kind: 'hidden', visibility: 'experimental-hidden' },
    { field: 'predictedNextState', kind: 'hidden', visibility: 'experimental-hidden' },
    { field: 'couplingStrength', kind: 'hidden', visibility: 'experimental-hidden' },
    { field: 'synchronizationCoefficient', kind: 'hidden', visibility: 'experimental-hidden' },
    { field: 'rawAnomalyFields', kind: 'hidden', visibility: 'experimental-hidden' },
    { field: 'diagnosticsInternals', kind: 'hidden', visibility: 'diagnostics-only' },
  ],
  personalRiskTimeline: [
    { field: 'points', kind: 'chart', visibility: 'always' },
    { field: 'trendDirection', kind: 'badge', visibility: 'always' },
    { field: 'confidence', kind: 'badge', visibility: 'always' },
    { field: 'baselineReferenceLabel', kind: 'textInsight', visibility: 'always' },
    { field: 'explanationCards', kind: 'textInsight', visibility: 'always' },
  ],
  teamDynamics: [
    { field: 'aggregateTrend', kind: 'chart', visibility: 'aggregate-only' },
    { field: 'propagationRisk', kind: 'badge', visibility: 'aggregate-only' },
    { field: 'synchronizedDeterioration', kind: 'badge', visibility: 'aggregate-only' },
    { field: 'confidence', kind: 'badge', visibility: 'aggregate-only' },
    { field: 'insightCards', kind: 'textInsight', visibility: 'aggregate-only' },
    { field: 'heatmap', kind: 'chart', visibility: 'aggregate-only' },
    { field: 'trendDetail', kind: 'textInsight', visibility: 'aggregate-only' },
  ],
})
