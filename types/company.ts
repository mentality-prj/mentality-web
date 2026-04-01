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

// ─── Paginated ────────────────────────────────────────────────────────────────

export type PaginatedEmployees = {
  items: EmployeeEntity[]
  total: number
}

export type PaginatedInvites = {
  items: InviteEntity[]
  total: number
}
