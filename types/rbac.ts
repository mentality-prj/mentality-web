export const COMPANY_ROLES = Object.freeze({
  SUPERUSER: 'SUPERUSER',
  MANAGER: 'MANAGER',
  EMPLOYEE: 'EMPLOYEE',
} as const)

export type CompanyRole = (typeof COMPANY_ROLES)[keyof typeof COMPANY_ROLES]

// ─── Feature-level access matrix ──────────────────────────────────────────────

export const CAN_MANAGE_GROUPS: CompanyRole[] = [COMPANY_ROLES.SUPERUSER]
export const CAN_INVITE_EMPLOYEES: CompanyRole[] = [COMPANY_ROLES.SUPERUSER, COMPANY_ROLES.MANAGER]
export const CAN_MANAGE_EMPLOYEES: CompanyRole[] = [COMPANY_ROLES.SUPERUSER]
export const CAN_ASSIGN_MANAGERS: CompanyRole[] = [COMPANY_ROLES.SUPERUSER]
export const CAN_VIEW_ANALYTICS: CompanyRole[] = [COMPANY_ROLES.SUPERUSER, COMPANY_ROLES.MANAGER]
