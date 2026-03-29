import { CompanyRole } from './rbac'

// ─── Entities ────────────────────────────────────────────────────────────────

export type CompanyEntity = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export type GroupEntity = {
  id: string
  name: string
  companyId: string
  parentId: string | null
  children: GroupEntity[]
  createdAt: string
  updatedAt: string
}

export type EmployeeEntity = {
  id: string
  name: string
  email: string
  role: CompanyRole
  groupIds: string[]
  groupsCount: number
  companyId: string
  createdAt: string
}

export type InviteStatus = 'pending' | 'accepted' | 'expired'

export type InviteEntity = {
  id: string
  email: string
  role: Extract<CompanyRole, 'EMPLOYEE' | 'MANAGER'>
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
  parentId?: string | null
}

export type UpdateGroupDto = {
  name?: string
  parentId?: string | null
}

export type CreateInviteDto = {
  email: string
  role: Extract<CompanyRole, 'EMPLOYEE' | 'MANAGER'>
  groupIds: string[]
}

export type CreateAccessScopeDto = {
  userId: string
  groupIds: string[]
  canViewAnalytics: boolean
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
