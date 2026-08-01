export type DipFeatureType = 'numeric' | 'categorical' | 'boolean' | 'text' | (string & {})
export type DipFeatureSource = 'events' | 'api' | 'computed' | (string & {})
export type DipWorkflowStatus = 'active' | 'inactive' | 'archived' | (string & {})
export type DipModelStatus = 'validated' | 'experimental' | 'baseline' | 'deprecated' | (string & {})
export type DipExperimentStatus = 'running' | 'completed' | 'failed' | 'draft' | (string & {})
export type DipDatasetStatus = 'ready' | 'processing' | 'error' | (string & {})
export type DipOrganizationMemberRole =
  | 'owner'
  | 'research_admin'
  | 'scientist'
  | 'analyst'
  | 'reviewer'
  | (string & {})
export type DipOrganizationUnitType = 'department' | 'lab' | 'team' | (string & {})

export type DipFeature = {
  id: string
  name: string
  type: DipFeatureType
  source: DipFeatureSource
  transformation: string | null
  version: string
  organizationId: string | null
  createdAt: string
}

export type DipRuleExecutionTrace = {
  rule: string
  matched: boolean
  conditionsEvaluated: number
}

export type DipDecisionRecord = {
  decisionId: string
  workflowId: string | null
  workflowName: string
  workflowVersion: string
  entityId: string | null
  organizationId: string | null
  decision: string
  ruleMatched: string
  engineVersion: string
  timestamp: string
  featuresUsed: Record<string, unknown>
  rulesExecuted: DipRuleExecutionTrace[]
}

export type DipWorkflow = {
  id: string
  name: string
  version: string
  status: DipWorkflowStatus
  organizationId: string | null
  createdAt: string
  rulesCount: number
}

export type DipOrganization = {
  id: string
  name: string
  status?: string
  createdAt: string
}

export type DipOrganizationMember = {
  id: string
  orgId: string
  name: string
  email: string
  role: DipOrganizationMemberRole
  unitId: string | null
  status: string
  createdAt: string
}

export type DipOrganizationUnit = {
  id: string
  orgId: string
  name: string
  type: DipOrganizationUnitType
  parentUnitId: string | null
  createdAt: string
}

export type DipOrganizationStructure = {
  organization: DipOrganization
  units: DipOrganizationUnit[]
  members: DipOrganizationMember[]
}

export type DipApiKey = {
  id: string
  keyPrefix: string
  orgId: string
  name: string
  environment: string
  scopes: string[]
  createdAt: string
  expiresAt: string | null
  revokedAt: string | null
  lastUsedAt: string | null
  createdBy: string
}

export type DipApiKeyCreated = DipApiKey & {
  key: string
}

export type DipConnectionStatus = {
  configured: boolean
  url: string | null
}

// ── v0.8 placeholder types ────────────────────────────────────────────────────

export type DipExperiment = {
  id: string
  name: string
  objective: string | null
  status: DipExperimentStatus
  algorithm: string | null
  datasetName: string | null
  datasetVersion: string | null
  primaryMetricName: string | null
  primaryMetricValue: number | null
  baselineMetricValue: number | null
  improvementPercent: number | null
  featuresCount: number
  createdAt: string
}

export type DipModelMetric = {
  name: string
  value: number
}

export type DipModel = {
  id: string
  name: string
  version: string
  algorithm: string
  status: DipModelStatus
  experimentId: string | null
  primaryMetricName: string | null
  primaryMetricValue: number | null
  metrics: DipModelMetric[]
  createdAt: string
}

export type DipDataset = {
  id: string
  name: string
  version: string
  rowsCount: number | null
  featuresCount: number
  coveragePercent: number | null
  missingPercent: number | null
  status: DipDatasetStatus
  createdAt: string
}
