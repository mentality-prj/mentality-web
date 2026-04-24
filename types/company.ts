import { CompanyRole } from './rbac'

// ─── Entities ────────────────────────────────────────────────────────────────

export type CompanyEntity = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export type GroupType = 'team' | 'department' | 'project'

export type GroupEntity = {
  id: string
  name: string
  type: GroupType
  companyId: string
  parentGroupId: string | null
  children: GroupEntity[]
  createdAt: string
  updatedAt: string
}

export type EmployeeEntity = {
  id: string
  name: string
  email: string
  avatarUrl?: string
  role: CompanyRole
  groupIds: string[]
  groupsCount: number
  groupId?: string
  groupName?: string
  companyId: string
  createdAt: string
  joinedAt?: string
}

export type UpdateEmployeeDto = {
  role?: CompanyRole
  groupIds?: string[]
}

export type InviteStatus = 'pending' | 'accepted' | 'expired'

export type InviteEntity = {
  id: string
  email: string
  role: Extract<CompanyRole, 'employee' | 'manager'>
  groupIds: string[]
  companyId: string
  status: InviteStatus
  createdAt: string
  expiresAt: string
}

export type AccessScopeEntity = {
  id: string
  userId: string
  groupIds: string[]
  canViewAnalytics: boolean
  companyId: string
  createdAt: string
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export type CreateCompanyDto = {
  name: string
}

export type CreateGroupDto = {
  name: string
  type: GroupType
  parentGroupId?: string | null
}

export type UpdateGroupDto = {
  name?: string
  type?: GroupType
  parentGroupId?: string | null
}

export type CreateInviteDto = {
  email: string
  role: Extract<CompanyRole, 'employee' | 'manager'>
  groupIds: string[]
}

export type CreateAccessScopeDto = {
  userId: string
  groupIds: string[]
  canViewAnalytics: boolean
}

export type AssignRoleDto = {
  companyRole: CompanyRole
  groupIds?: string[]
}

// ─── Analytics ─────────────────────────────────────────────────────────────────

export type RiskDistribution = {
  low: number
  medium: number
  high: number
}

export type AnalyticsMaskReason = 'small_cohort' | 'composition_changed' | 'low_activity'

export type AnalyticsPrivacy = {
  isMasked: boolean
  maskReasons: AnalyticsMaskReason[]
}

export type AnalyticsPreferences = {
  sprintAnchorDay: number
  nextAllowedUpdateAt: string | null
}

export type UpdateAnalyticsPreferencesDto = {
  sprintAnchorDay: number
}

export type AnalyticsGroupResult = {
  groupId: string
  groupName: string
  groupType: GroupType
  totalEmployees: number
  activeEmployees: number
  totalCheckins: number
  avgMood: number
  avgStress: number
  avgEnergy: number
  avgFocus: number
  riskDistribution: RiskDistribution
}

export type AnalyticsTrendPoint = {
  period: string
  avgMood: number
  avgStress: number
  avgEnergy: number
  avgFocus: number
  checkins: number
}

export type AnalyticsTrendChartPoint = {
  period: string
  periodLabel: string
  avgMood: number | null
  avgStress: number | null
  avgEnergy: number | null
  avgFocus: number | null
  checkins: number | null
  isGap: boolean
}

export type AnalyticsResponse = {
  companyId: string
  from: string
  to: string
  privacy: AnalyticsPrivacy
  totalEmployees: number
  activeEmployees: number
  totalCheckins: number
  avgMood: number
  avgStress: number
  avgEnergy: number
  avgFocus: number
  riskDistribution: RiskDistribution
  groups: AnalyticsGroupResult[]
  trend: AnalyticsTrendPoint[]
}

// ─── Paginated ────────────────────────────────────────────────────────────────

export type PaginatedEmployees = {
  items: EmployeeEntity[]
  total: number
}

export type PaginatedInvites = {
  items: InviteEntity[]
  total: number
}
