export type ViewerRole = 'employee' | 'manager' | 'admin'

export type ViewMode = 'operational' | 'diagnostics'

export type VisibilityRule = 'always' | 'admin-only' | 'diagnostics-only' | 'aggregate-only' | 'experimental-hidden'

export type PresentationKind = 'textInsight' | 'chart' | 'badge' | 'hidden'

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unknown'

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'unknown'

export type TrendDirection = 'improving' | 'stable' | 'worsening' | 'unknown'

export type InspectionTargetType = 'company' | 'team'

export type RiskEventActionKind = 'one_on_one_meeting' | 'reduce_workload' | 'team_sync'

export type VisibilityContext = {
  viewerRole: ViewerRole
  mode: ViewMode
  aggregateOnly?: boolean
  experimentalFlags?: string[]
}

export type PresentationFieldPolicy = {
  field: string
  kind: PresentationKind
  visibility: VisibilityRule
}

export type ExplainabilityVM = {
  whatHappened: string
  whyShown: string
  reliability: string
  recommendedAction: string
}

export type WhySeeingThisVM = {
  recentChanges: string[]
  contributingFactors: string[]
  dataCompleteness: string
  explanationText: string
}

export type InsightFactVM = {
  label: string
  value: string
}

export type TrendPointVM = {
  label: string
  value: number | null
  baseline: number | null
  confidence: number | null
}

export type ConfidenceBadgeVM = {
  id: string
  level: ConfidenceLevel
  label: string
  score: number | null
  reason: string
  improveQualityHint: string | null
  visibilityRules: VisibilityRule[]
}

export type InsightCardVM = {
  id: string
  title: string
  text: string
  supportingText: string | null
  tone: 'neutral' | 'positive' | 'caution' | 'critical'
  presentation: PresentationKind
  confidence: ConfidenceBadgeVM | null
  recommendedAction: string | null
  updatedAt: string | null
  visibilityRules: VisibilityRule[]
}

export type ReportRankingItemVM = {
  id: string
  label: string
  rank: number | null
  valueLabel: string | null
  supportingText: string | null
  visibilityRules: VisibilityRule[]
}

export type ReportOverviewVM = {
  id: string
  companyHealthSummary: InsightCardVM[]
  actionsList: InsightCardVM[]
  teamRanking: ReportRankingItemVM[]
  signalsSummary: InsightCardVM[]
  interpretationGuidance: string[]
  executiveSummary: InsightCardVM | null
  confidenceStrip: ConfidenceBadgeVM[]
  updatedAt: string | null
  hiddenFieldKeys: string[]
  visibilityRules: VisibilityRule[]
}

export type RiskEventDetailVM = {
  status: string | null
  effectSizeLabel: string | null
  history: string[]
  performedActions: string[]
  outcome: string | null
  explainability: ExplainabilityVM
  recommendedActions: string[]
  diagnostics: InsightFactVM[]
}

export type RiskEventVM = {
  id: string
  title: string
  severity: RiskLevel
  status: string
  confidence: ConfidenceBadgeVM
  summary: string
  financialRange: string | null
  lastSeenAt: string | null
  explainability: ExplainabilityVM
  recommendedActions: string[]
  details: RiskEventDetailVM | null
  visibilityRules: VisibilityRule[]
}

export type MLInspectionVM = {
  targetType: InspectionTargetType
  targetId: string
  cards: {
    riskScore: InsightCardVM
    anomaly: InsightCardVM
    probability: InsightCardVM
    modelVersion: InsightCardVM
  }
  details: InsightCardVM[]
  diagnostics: InsightFactVM[]
  confidence: ConfidenceBadgeVM | null
  visibilityRules: VisibilityRule[]
}

export type PersonalRiskOverviewVM = {
  currentRiskLevel: InsightCardVM
  deviationFromBaseline: InsightCardVM
  confidence: ConfidenceBadgeVM
  recentTrend: InsightCardVM
  topInsights: InsightCardVM[]
  updatedAt: string | null
  whySeeingThis: WhySeeingThisVM
  visibilityRules: VisibilityRule[]
}

export type PersonalRiskTimelineVM = {
  period: '7d' | '14d' | '30d'
  trendDirection: TrendDirection
  confidence: ConfidenceBadgeVM
  points: TrendPointVM[]
  baselineReferenceLabel: string
  explanationCards: InsightCardVM[]
  whySeeingThis: WhySeeingThisVM | null
  visibilityRules: VisibilityRule[]
}

export type TeamHeatmapRowVM = {
  id: string
  label: string
  intensity: 'low' | 'medium' | 'high' | 'masked'
  aggregateLabel: string
  visibilityRules: VisibilityRule[]
}

export type TeamDynamicsVM = {
  aggregateTrend: {
    title: string
    points: TrendPointVM[]
  }
  propagationRisk: InsightCardVM
  synchronizedDeterioration: InsightCardVM
  confidence: ConfidenceBadgeVM
  insightCards: InsightCardVM[]
  heatmap: TeamHeatmapRowVM[]
  trendDetail: {
    keyChanges: string[]
    recommendedInterventions: string[]
    privacyState: string
  }
  visibilityRules: VisibilityRule[]
}
