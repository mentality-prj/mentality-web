export type ResearchWorkspaceCapability = 'scientist' | 'research_admin'
export type ResearchProjectStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived' | (string & {})
export type ResearchApprovalStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | (string & {})
export type ResearchExportPolicy = 'blocked' | 'review_required' | 'allowed' | (string & {})
export type ResearchPseudonymizationMode = 'required' | 'optional' | 'none' | (string & {})
export type ResearchUserSelectionMode = 'all' | 'groups_only' | 'explicit_users' | (string & {})
export type ResearchConsentMode =
  | 'company_boundary_only'
  | 'explicit_research_consent'
  | 'external_irb_approved'
  | (string & {})
export type ResearchWorkspaceRole = 'owner' | 'research_admin' | 'scientist' | 'analyst' | 'reviewer' | (string & {})
export type ResearchGrant = string
export type ResearchDatasetStatus = string
export type ResearchDatasetAccessMode = string
export type ResearchModelRunStatus = string
export type ResearchExportStatus =
  | 'not_requested'
  | 'pending_review'
  | 'pending_approval'
  | 'running'
  | 'ready'
  | 'completed'
  | 'rejected'
  | (string & {})
export type ResearchAuditSeverity = string
export type ResearchExportFormat = 'json' | 'csv' | (string & {})

export type ResearchWorkspaceCompanyOption = {
  id: string
  name: string
}

export type ResearchScientistOption = {
  id: string
  name: string
  email: string
}

export type ResearchScopedScientistOption = ResearchScientistOption & {
  companyId: string
}

export type ResearchProjectPermissionSet = {
  canViewProject: boolean
  canCreateProject: boolean
  canUpdateProject: boolean
  canManageMembers: boolean
  canManageCohort: boolean
  canManageGrants: boolean
  canViewMlInspection: boolean
  canViewHistoryDataset: boolean
  canRequestExports: boolean
  canViewAudit: boolean
}

export type ResearchProjectMember = {
  id: string
  userId: string
  name: string
  email: string
  role: ResearchWorkspaceRole
  grants: ResearchGrant[]
  createdAt: string | null
  canRemove: boolean
}

export type ResearchProjectGroup = {
  id: string
  name: string
  type: 'team' | 'project-group' | 'unit' | (string & {})
}

export type ResearchProjectCohort = {
  groupIds: string[]
  userSelectionMode: ResearchUserSelectionMode
  from: string | null
  to: string | null
  resolvedGroupIds: string[]
}

export type ResearchProjectCohortInput = {
  groupIds: string[]
  userSelectionMode: ResearchUserSelectionMode
  from: string | null
  to: string | null
  pseudonymizationMode?: ResearchPseudonymizationMode | null
}

export type ResearchProjectGrant = {
  id: string
  title: string
  allowedContracts: string[]
  allowedFields: string[]
  allowedTargets: string[]
  groupIds: string[]
  userSelectionMode: ResearchUserSelectionMode
  pseudonymizationMode: ResearchPseudonymizationMode
  from: string | null
  to: string | null
  exportAllowed: boolean
  createdAt: string | null
}

export type ResearchProjectGrantInput = {
  allowedContracts: string[]
  allowedFields: string[]
  allowedTargets: string[]
  groupIds: string[]
  userSelectionMode: ResearchUserSelectionMode
  pseudonymizationMode: ResearchPseudonymizationMode
  from: string | null
  to: string | null
  exportAllowed: boolean
}

export type ResearchDataset = {
  id: string
  label: string
  description: string
  status: ResearchDatasetStatus
  defaultAccess: ResearchDatasetAccessMode
}

export type ResearchModelRun = {
  id: string
  label: string
  status: ResearchModelRunStatus
  modelVersion: string
  completedAt: string | null
}

export type ResearchExportJob = {
  id: string
  status: ResearchExportStatus
  format: ResearchExportFormat
  requestedAt: string | null
  completedAt: string | null
}

export type ResearchAuditAlert = {
  id: string
  severity: ResearchAuditSeverity
  title: string
  text: string
}

export type ResearchProjectDiagnostics = {
  modelVersion: string
  riskScore: string
  anomalyScore: string
  adaptiveRisk: string
  modelHealth: string
  rawFeatureVector: string[] | null
  auditLog: string[]
}

export type ResearchMLInspectionQuery = {
  target: string
  targetId?: string
  modelVersion?: string
}

export type ResearchMLInspection = {
  target: string
  targetId: string | null
  modelVersion: string | null
  contract: string | null
  governanceMetadata: Record<string, string>
  payload: Record<string, unknown>
}

export type ResearchHistoryDatasetFilters = {
  from?: string
  to?: string
  limit?: number
}

export type ResearchHistoryDatasetItem = {
  id: string
  subjectId: string
  cohort: string
  dateRange: string
  diagnostics: string
  fields: Record<string, string>
  raw: Record<string, unknown>
}

export type ResearchHistoryDataset = {
  items: ResearchHistoryDatasetItem[]
  columns: string[]
  total: number | null
}

export type ResearchExportRequest = {
  format: ResearchExportFormat
  requestedFields: string[]
  reason: string
}

export type ResearchExportReadyResult = {
  status: 'ready'
  format: ResearchExportFormat
  fileName: string
  content: string
  metadata: Record<string, string>
}

export type ResearchExportPendingResult = {
  status: 'pending_review'
  format: ResearchExportFormat
  fileName: string
  content: string
  metadata: Record<string, string>
}

export type ResearchExportResponse = ResearchExportReadyResult | ResearchExportPendingResult

export type ResearchAuditEvent = {
  id: string
  eventType: string
  actorUserId: string
  route: string
  createdAt: string
  details: string
  metadata: Record<string, string>
}

export type ResearchProjectMutationInput = {
  companyId: string
  name: string
  description: string
  objective: string
  status: ResearchProjectStatus
  approvalStatus: ResearchApprovalStatus
  exportPolicy: ResearchExportPolicy
  pseudonymizationMode: ResearchPseudonymizationMode
  principalInvestigatorId: string
  retentionUntil: string | null
  consentMode: ResearchConsentMode
}

export type ResearchProject = {
  id: string
  name: string
  description: string
  objective: string
  status: ResearchProjectStatus
  approvalStatus: ResearchApprovalStatus
  exportPolicy: ResearchExportPolicy
  pseudonymizationMode: ResearchPseudonymizationMode
  principalInvestigatorId: string
  retentionUntil: string | null
  consentMode: ResearchConsentMode
  companyId: string
  companyName: string
  currentUserRole: ResearchWorkspaceRole | null
  permissions: ResearchProjectPermissionSet
  createdAt: string | null
  updatedAt: string | null
  metadata: Record<string, string>
  startsAt: string
  endsAt: string
  targetCohort: string
  cohortSize: number
  rawMlFeaturesAllowed: boolean
  exportAllowed: boolean
  pseudonymizationRequired: boolean
  availableGroups: ResearchProjectGroup[]
  selectedGroupIds: string[]
  inclusionRules: string[]
  members: ResearchProjectMember[]
  grantsList: ResearchProjectGrant[]
  cohort: ResearchProjectCohort | null
  availableDatasets: ResearchDataset[]
  latestModelRuns: ResearchModelRun[]
  exportJob: ResearchExportJob
  auditAlerts: ResearchAuditAlert[]
  exportAuditLog: string[]
  diagnostics: ResearchProjectDiagnostics
}

export type ResearchWorkspaceAccess = {
  hasAccess: boolean
  canCreateProjects: boolean
  capabilities: ResearchWorkspaceCapability[]
  companies: ResearchWorkspaceCompanyOption[]
  scientists: ResearchScientistOption[]
}
