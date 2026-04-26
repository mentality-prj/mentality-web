import { EmployeeEntity, InviteEntity, InviteStatus } from '@/types/company'
import { COMPANY_ROLES, CompanyRole } from '@/types/rbac'

function safeString(value: unknown): string {
  if (typeof value === 'string') return value
  if (value == null) return ''
  return String(value)
}

function safeRole(value: unknown): CompanyRole {
  const v = safeString(value).toLowerCase()
  if (Object.values(COMPANY_ROLES).includes(v as CompanyRole)) return v as CompanyRole
  return COMPANY_ROLES.EMPLOYEE
}

function safeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(safeString).filter(Boolean)
  return []
}

export function mapEmployee(input: unknown): EmployeeEntity | null {
  if (!input || typeof input !== 'object') return null
  const obj = input as Record<string, unknown>

  const id = safeString(obj.id ?? obj._id ?? obj.userId ?? '')
  if (!id) return null

  const groupId = obj.groupId != null ? safeString(obj.groupId) : undefined
  const safeGroupIds = safeStringArray(obj.groupIds)
  const groupIds = safeGroupIds.length ? safeGroupIds : groupId ? [groupId] : []

  return {
    id,
    name: safeString(obj.name),
    email: safeString(obj.email),
    avatarUrl: obj.avatarUrl != null ? safeString(obj.avatarUrl) : undefined,
    role: safeRole(obj.companyRole ?? obj.role),
    groupIds,
    groupsCount: typeof obj.groupsCount === 'number' ? obj.groupsCount : groupIds.length,
    groupId,
    groupName: obj.groupName != null ? safeString(obj.groupName) : undefined,
    companyId: safeString(obj.companyId),
    createdAt: safeString(obj.createdAt ?? obj.joinedAt ?? ''),
    joinedAt: obj.joinedAt != null ? safeString(obj.joinedAt) : undefined,
    gradeId: obj.gradeId != null ? safeString(obj.gradeId) : undefined,
    gradeName: obj.gradeName != null ? safeString(obj.gradeName) : undefined,
    avgAnnualSalaryEur: typeof obj.avgAnnualSalaryEur === 'number' ? obj.avgAnnualSalaryEur : undefined,
  }
}

export function mapEmployees(input: unknown): EmployeeEntity[] {
  if (!input) return []
  if (Array.isArray(input)) return input.map(mapEmployee).filter((e): e is EmployeeEntity => e !== null)
  if (typeof input === 'object') {
    const obj = input as Record<string, unknown>
    if (Array.isArray(obj.items)) return mapEmployees(obj.items)
    if (Array.isArray(obj.data)) return mapEmployees(obj.data)
  }
  return []
}

export function mapInvite(input: unknown): InviteEntity | null {
  if (!input || typeof input !== 'object') return null
  const obj = input as Record<string, unknown>

  const id = safeString(obj.id ?? obj._id ?? '')
  if (!id) return null

  const statusRaw = safeString(obj.status).toLowerCase()
  const validStatuses: InviteStatus[] = ['pending', 'accepted', 'declined', 'cancelled', 'expired']
  const status: InviteStatus = validStatuses.includes(statusRaw as InviteStatus)
    ? (statusRaw as InviteStatus)
    : 'pending'

  const role = safeRole(obj.role)
  if (role !== COMPANY_ROLES.EMPLOYEE && role !== COMPANY_ROLES.MANAGER) {
    return null
  }

  const groupIds = safeStringArray(obj.groupIds)
  const singleGroupId = safeString(obj.groupId)

  return {
    id,
    email: safeString(obj.email ?? obj.inviteeEmail),
    role: role as Extract<CompanyRole, 'employee' | 'manager'>,
    groupIds: groupIds.length ? groupIds : singleGroupId ? [singleGroupId] : [],
    groupName: obj.groupName != null ? safeString(obj.groupName) : undefined,
    companyId: safeString(obj.companyId),
    status,
    createdAt: safeString(obj.createdAt),
    expiresAt: obj.expiresAt != null ? safeString(obj.expiresAt) : undefined,
  }
}

export function mapInvites(input: unknown): InviteEntity[] {
  if (!input) return []
  if (Array.isArray(input)) return input.map(mapInvite).filter((i): i is InviteEntity => i !== null)
  if (typeof input === 'object') {
    const obj = input as Record<string, unknown>
    if (Array.isArray(obj.items)) return mapInvites(obj.items)
    if (Array.isArray(obj.data)) return mapInvites(obj.data)
  }
  return []
}
