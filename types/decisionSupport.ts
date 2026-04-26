export type GranularityLevel = 'full' | 'reduced' | 'baseline-only' | 'insufficient-data'
export type EvidenceStrength = 'low' | 'medium' | 'high'
export type BucketType = 'low' | 'medium' | 'high'
export type TrendBucket = 'improving' | 'stable' | 'worsening'
export type TeamSizeBucket = 'small' | 'medium' | 'large'

export type CoverageComponents = {
  sampleSizeComponent: number
  completenessComponent: number
  inconclusiveComponent: number
}

export type RiskAssociationEvidenceEntity = {
  eventId: string
  companyId: string
  granularityLevel: GranularityLevel
  descriptiveOnly: boolean
  evidenceStrength: EvidenceStrength
  rawN: number
  effectiveN: number
  evaluatedN: number
  dataCoverageScore: number
  coverageComponents: CoverageComponents
  inconclusiveRate: number
  improvedRateAmongEvaluated: number
  improvedRate: number
  uplift?: number
  baselineBucket?: BucketType
  trendBucket?: TrendBucket
  teamSizeBucket?: TeamSizeBucket
  lastComputedAt: string
  dataFreshnessDays: number
  summary?: string
}

// Backward-compatible alias
export type RiskEventEvidence = RiskAssociationEvidenceEntity
export type CohortGranularityLevel = GranularityLevel

export type DecisionSupportPriority = 'low' | 'medium' | 'high' | 'critical'
export type DecisionSupportSeverity = 'low' | 'medium' | 'high' | 'critical'
export type DecisionSupportRiskEventStatus = 'active' | 'escalating' | 'resolved' | 'suppressed'

export type DecisionSupportExecutiveSummary = {
  overallStatus: string | null
  headline: string | null
  confidence: number | null
  risks: string[]
  recommendations: string[]
}

export type DecisionSupportActionExpectedImpact = {
  stressReduction: number | null
  retentionImpact: number | null
}

export type DecisionSupportAction = {
  id: string
  eventId: string | null
  riskEventId: string | null
  priority: DecisionSupportPriority | null
  severity: DecisionSupportSeverity | null
  confidence: number | null
  title: string
  description: string
  target: string | null
  targetId: string | null
  expectedImpact: DecisionSupportActionExpectedImpact | null
}

export type DecisionSupportTeamRankingItem = {
  groupId: string
  groupName: string
  riskScore: number | null
  rank: number | null
}

export type DecisionSupportGroupBurnoutItem = {
  groupId: string
  groupName: string
  burnoutRisk: number | null
}

export type DecisionSupportCompanyImpact = {
  totalEstimatedRiskEur: number | null
  estimatedAttritionCostEur: number | null
  estimatedProductivityLossEur: number | null
}

export type DecisionSupportGroupImpact = {
  groupId: string
  groupName: string
  totalEstimatedRiskEur: number | null
  estimatedAttritionCostEur: number | null
  estimatedProductivityLossEur: number | null
}

export type DecisionSupportAnalyticsGuard = {
  reasonCodes: string[]
  interpretationGuidance: string | null
}

export type DecisionSupportReport = {
  executiveSummary: DecisionSupportExecutiveSummary | null
  actions: DecisionSupportAction[]
  teamRanking: DecisionSupportTeamRankingItem[]
  groupBurnouts: DecisionSupportGroupBurnoutItem[]
  companyImpact: DecisionSupportCompanyImpact | null
  groupImpacts: DecisionSupportGroupImpact[]
  changeTracking: Record<string, unknown> | null
  analyticsGuard: DecisionSupportAnalyticsGuard | null
}

export type DecisionSupportRiskEvent = {
  id: string
  title: string
  status: DecisionSupportRiskEventStatus
  severity: DecisionSupportSeverity | null
  priority: DecisionSupportPriority | null
  occurrenceCount: number | null
  lastSeenAt: string | null
  estimatedImpactEur: number | null
}

export type AddressRiskEventDto = {
  addressed: boolean
}
