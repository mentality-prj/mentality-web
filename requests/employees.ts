import { COMPANY_ADMIN_ENDPOINTS, EMPLOYEE_ENDPOINTS } from '@/constants/companyEndpoints'
import { extractPaginationTotal } from '@/lib/http'
import { logger } from '@/lib/logger'
import { mapEmployee, mapEmployees } from '@/mappers/company.mappers'
import { CustomSession } from '@/types/auth'
import { EmployeeEntity, PaginatedEmployees } from '@/types/company'
import { CAN_MANAGE_EMPLOYEES, CompanyRole } from '@/types/rbac'

import { APIUrl } from './config'
import { performAdminRequest, performAuthRequest } from './genericFetch'

function assertCanManageEmployees(session: CustomSession | null): boolean {
  const role = session?.user?.companyRole
  return !!role && CAN_MANAGE_EMPLOYEES.includes(role)
}

export async function getEmployees(
  session: CustomSession | null,
  page = 1,
  limit = 20
): Promise<{ data: PaginatedEmployees } | { error: string }> {
  const url = `${APIUrl}${EMPLOYEE_ENDPOINTS.paginated(page, limit)}`
  const res = await performAuthRequest<EmployeeEntity[]>(session, url)

  if ('error' in res) {
    logger.error('Failed to fetch employees', { error: res.error })
    return { error: res.error }
  }

  const items = mapEmployees(res.data)
  const total = extractPaginationTotal(res.headers, items.length)
  return { data: { items, total } }
}

export async function getEmployeesByRole(
  session: CustomSession | null,
  role: CompanyRole
): Promise<{ data: EmployeeEntity[] } | { error: string }> {
  const url = `${APIUrl}${EMPLOYEE_ENDPOINTS.byRole(role)}`
  const res = await performAuthRequest<EmployeeEntity[]>(session, url)

  if ('error' in res) {
    logger.error('Failed to fetch employees by role', { error: res.error, role })
    return { error: res.error }
  }

  return { data: mapEmployees(res.data) }
}

export async function removeEmployee(
  session: CustomSession | null,
  id: string
): Promise<{ data: EmployeeEntity } | { error: string }> {
  if (!assertCanManageEmployees(session)) {
    logger.warn('Unauthorized attempt to remove employee', { userId: session?.user?.email })
    return { error: 'Unauthorized: insufficient role' }
  }

  const res = await performAuthRequest<EmployeeEntity>(session, `${APIUrl}${EMPLOYEE_ENDPOINTS.byId(id)}`, {
    method: 'DELETE',
  })

  if ('error' in res) {
    logger.error('Failed to remove employee', { error: res.error, id })
    return { error: res.error }
  }

  const mapped = mapEmployee(res.data)
  if (!mapped) {
    logger.error('Invalid employee data returned from API', { id })
    return { error: 'Invalid employee data' }
  }

  logger.info('Employee removed', { id })
  return { data: mapped }
}

// ─── Admin-scoped (per-company) variants ──────────────────────────────────────

export async function getEmployeesAdmin(
  session: CustomSession | null,
  companyId: string,
  page = 1,
  limit = 20
): Promise<{ data: PaginatedEmployees } | { error: string }> {
  const url = `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.employees(companyId, page, limit)}`
  const res = await performAdminRequest<EmployeeEntity[]>(session, url)
  if ('error' in res) {
    logger.error('Admin: failed to fetch employees', { error: res.error, companyId })
    return { error: res.error }
  }
  const items = mapEmployees(res.data)
  const total = extractPaginationTotal(res.headers, items.length)
  return { data: { items, total } }
}

export async function removeEmployeeAdmin(
  session: CustomSession | null,
  companyId: string,
  id: string
): Promise<{ data: EmployeeEntity } | { error: string }> {
  const res = await performAdminRequest<EmployeeEntity>(
    session,
    `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.employeeById(companyId, id)}`,
    { method: 'DELETE' }
  )
  if ('error' in res) {
    logger.error('Admin: failed to remove employee', { error: res.error, companyId, id })
    return { error: res.error }
  }
  const mapped = mapEmployee(res.data)
  if (!mapped) return { error: 'Invalid employee data' }
  logger.info('Admin: employee removed', { id, companyId })
  return { data: mapped }
}
