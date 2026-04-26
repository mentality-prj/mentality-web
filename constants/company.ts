import { InviteStatus } from '@/types/company'
import { COMPANY_ROLES, CompanyRole } from '@/types/rbac'

export const COMPANY_PAGE_SIZE = 20

export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000

export const INVITE_STATUS_CLASSES: Record<InviteStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  cancelled: 'bg-slate-100 text-slate-600',
  expired: 'bg-gray-100 text-gray-500',
}

export type InviteRole = Extract<CompanyRole, 'employee' | 'manager'>

export const INVITE_ROLE_VALUES: InviteRole[] = [COMPANY_ROLES.EMPLOYEE, COMPANY_ROLES.MANAGER]
