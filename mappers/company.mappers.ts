import { EmployeeEntity, InviteEntity, InviteStatus } from '@/types/company'
import { COMPANY_ROLES, CompanyRole } from '@/types/rbac'

function safeString(value: unknown): string {
  if (typeof value === 'string') return value
  if (value == null) return ''
  return String(value)
}

function safeRole(value: unknown): CompanyRole {
  const v = safeString(value).toUpperCase()
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

  const id = safeString(obj.id ?? obj._id ?? '')
  if (!id) return null

  return {
    id,
    name: safeString(obj.name),
    email: safeString(obj.email),
    role: safeRole(obj.role),
    groupIds: safeStringArray(obj.groupIds),
    groupsCount: typeof obj.groupsCount === 'number' ? obj.groupsCount : safeStringArray(obj.groupIds).length,
    companyId: safeString(obj.companyId),
    createdAt: safeString(obj.createdAt),
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
  const validStatuses: InviteStatus[] = ['pending', 'accepted', 'expired']
  const status: InviteStatus = validStatuses.includes(statusRaw as InviteStatus)
    ? (statusRaw as InviteStatus)
    : 'pending'

  const role = safeRole(obj.role)
  if (role !== COMPANY_ROLES.EMPLOYEE && role !== COMPANY_ROLES.MANAGER) {
    return null
  }

  return {
    id,
    email: safeString(obj.email),
    role: role as Extract<CompanyRole, 'EMPLOYEE' | 'MANAGER'>,
    groupIds: safeStringArray(obj.groupIds),
    companyId: safeString(obj.companyId),
    status,
    createdAt: safeString(obj.createdAt),
    expiresAt: safeString(obj.expiresAt),
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
