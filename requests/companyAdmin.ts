import { COMPANY_ADMIN_ENDPOINTS } from '@/constants/companyEndpoints'
import { extractPaginationTotal } from '@/lib/http'
import { logger } from '@/lib/logger'
import { mapEmployee, mapEmployees, mapInvite, mapInvites } from '@/mappers/company.mappers'
import { mapGroup, mapGroups } from '@/mappers/group.mappers'
import { CustomSession } from '@/types/auth'
import {
  AccessScopeEntity,
  AssignRoleDto,
  CreateAccessScopeDto,
  CreateGroupDto,
  CreateInviteDto,
  EmployeeEntity,
  GroupEntity,
  InviteEntity,
  PaginatedEmployees,
  PaginatedInvites,
  UpdateGroupDto,
} from '@/types/company'

import { APIUrl } from './config'
import { performAdminRequest } from './genericFetch'
import { extractInviteArray, extractInviteTotal } from './inviteResponse.helpers'

function toBackendInvitePayload(dto: CreateInviteDto): Record<string, unknown> {
  return {
    inviteeEmail: dto.email,
    role: dto.role,
    groupId: dto.groupIds[0],
  }
}

// ─── Employees ────────────────────────────────────────────────────────────────

export async function adminGetEmployees(
  session: CustomSession | null,
  companyId: string,
  page = 1,
  limit = 20
): Promise<{ data: PaginatedEmployees } | { error: string }> {
  const url = `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.employees(companyId, page, limit)}`
  const res = await performAdminRequest<EmployeeEntity[]>(session, url)

  if ('error' in res) {
    logger.error('Failed to fetch company employees', { error: res.error, companyId })
    return { error: res.error }
  }

  const items = mapEmployees(res.data)
  const total = extractPaginationTotal(res.headers, items.length)
  return { data: { items, total } }
}

export async function adminRemoveEmployee(
  session: CustomSession | null,
  companyId: string,
  empId: string
): Promise<{ data: EmployeeEntity } | { error: string }> {
  const res = await performAdminRequest<EmployeeEntity>(
    session,
    `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.employeeById(companyId, empId)}`,
    { method: 'DELETE' }
  )

  if ('error' in res) {
    logger.error('Failed to remove company employee', { error: res.error, companyId, empId })
    return { error: res.error }
  }

  const mapped = mapEmployee(res.data)
  if (!mapped) {
    logger.error('Invalid employee data returned from API', { empId })
    return { error: 'Invalid employee data' }
  }

  logger.info('Employee removed', { companyId, empId })
  return { data: mapped }
}

export async function adminAssignRole(
  session: CustomSession | null,
  companyId: string,
  empId: string,
  dto: AssignRoleDto
): Promise<{ data: EmployeeEntity } | { error: string }> {
  const res = await performAdminRequest<EmployeeEntity>(
    session,
    `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.employeeRole(companyId, empId)}`,
    { method: 'PATCH', body: dto as unknown as Record<string, unknown> }
  )

  if ('error' in res) {
    logger.error('Failed to assign employee role', { error: res.error, companyId, empId })
    return { error: res.error }
  }

  const mapped = mapEmployee(res.data)
  if (!mapped) {
    logger.error('Invalid employee data returned from API', { empId })
    return { error: 'Invalid employee data' }
  }

  logger.info('Employee role assigned', { companyId, empId, role: dto.companyRole })
  return { data: mapped }
}

// ─── Groups ───────────────────────────────────────────────────────────────────

export async function adminGetGroups(
  session: CustomSession | null,
  companyId: string
): Promise<{ data: GroupEntity[] } | { error: string }> {
  const res = await performAdminRequest<GroupEntity[]>(session, `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.groups(companyId)}`)

  if ('error' in res) {
    logger.error('Failed to fetch company groups', { error: res.error, companyId })
    return { error: res.error }
  }

  return { data: mapGroups(res.data) }
}

export async function adminCreateGroup(
  session: CustomSession | null,
  companyId: string,
  dto: CreateGroupDto
): Promise<{ data: GroupEntity } | { error: string }> {
  const res = await performAdminRequest<GroupEntity>(session, `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.groups(companyId)}`, {
    method: 'POST',
    body: dto as unknown as Record<string, unknown>,
  })

  if ('error' in res) {
    logger.error('Failed to create company group', { error: res.error, companyId })
    return { error: res.error }
  }

  const mapped = mapGroup(res.data)
  if (!mapped) {
    logger.error('Invalid group data returned from API', { companyId })
    return { error: 'Invalid group data' }
  }

  logger.info('Company group created', { companyId, name: dto.name })
  return { data: mapped }
}

export async function adminUpdateGroup(
  session: CustomSession | null,
  companyId: string,
  id: string,
  dto: UpdateGroupDto
): Promise<{ data: GroupEntity } | { error: string }> {
  const res = await performAdminRequest<GroupEntity>(
    session,
    `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.groupById(companyId, id)}`,
    { method: 'PATCH', body: dto as unknown as Record<string, unknown> }
  )

  if ('error' in res) {
    logger.error('Failed to update company group', { error: res.error, companyId, id })
    return { error: res.error }
  }

  const mapped = mapGroup(res.data)
  if (!mapped) {
    logger.error('Invalid group data returned from API', { companyId, id })
    return { error: 'Invalid group data' }
  }

  logger.info('Company group updated', { companyId, id })
  return { data: mapped }
}

export async function adminDeleteGroup(
  session: CustomSession | null,
  companyId: string,
  id: string
): Promise<Record<string, never> | { error: string }> {
  const res = await performAdminRequest(session, `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.groupById(companyId, id)}`, {
    method: 'DELETE',
  })

  if ('error' in res) {
    logger.error('Failed to delete company group', { error: res.error, companyId, id })
    return { error: res.error }
  }

  logger.info('Company group deleted', { companyId, id })
  return {}
}

// ─── Invites ──────────────────────────────────────────────────────────────────

export async function adminGetInvites(
  session: CustomSession | null,
  companyId: string,
  page = 1,
  limit = 20
): Promise<{ data: PaginatedInvites } | { error: string }> {
  const url = `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.invites(companyId, page, limit)}`
  const res = await performAdminRequest<unknown>(session, url)

  if ('error' in res) {
    logger.error('Failed to fetch company invites', { error: res.error, companyId })
    return { error: res.error }
  }

  const normalized = extractInviteArray(res.data)
  const items = mapInvites(normalized)
  const total = extractInviteTotal(res.data, res.headers, items.length)
  return { data: { items, total } }
}

export async function adminCreateInvite(
  session: CustomSession | null,
  companyId: string,
  dto: CreateInviteDto
): Promise<{ data: InviteEntity } | { error: string }> {
  if (!dto.groupIds.length) {
    logger.error('Failed to create company invite: no group selected', { companyId })
    return { error: 'Group is required' }
  }

  const res = await performAdminRequest<InviteEntity>(
    session,
    `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.inviteBase(companyId)}`,
    { method: 'POST', body: toBackendInvitePayload(dto) }
  )

  if ('error' in res) {
    logger.error('Failed to create company invite', { error: res.error, companyId })
    return { error: res.error }
  }

  const mapped = mapInvite(res.data)
  if (!mapped) {
    logger.error('Invalid invite data returned from API', { companyId })
    return { error: 'Invalid invite data' }
  }

  logger.info('Company invite sent', { companyId })
  return { data: mapped }
}

export async function adminResendInvite(
  session: CustomSession | null,
  companyId: string,
  inviteId: string
): Promise<{ data: InviteEntity } | { error: string }> {
  const res = await performAdminRequest<InviteEntity>(
    session,
    `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.inviteResend(companyId, inviteId)}`,
    { method: 'POST' }
  )

  if ('error' in res) {
    logger.error('Failed to resend company invite', { error: res.error, companyId, inviteId })
    return { error: res.error }
  }

  const mapped = mapInvite(res.data)
  if (!mapped) {
    logger.error('Invalid invite data returned from API', { companyId, inviteId })
    return { error: 'Invalid invite data' }
  }

  logger.info('Company invite resent', { companyId, inviteId })
  return { data: mapped }
}

export async function adminCancelInvite(
  session: CustomSession | null,
  companyId: string,
  inviteId: string
): Promise<Record<string, never> | { error: string }> {
  const res = await performAdminRequest(
    session,
    `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.inviteById(companyId, inviteId)}`,
    { method: 'DELETE' }
  )

  if ('error' in res) {
    logger.error('Failed to cancel company invite', { error: res.error, companyId, inviteId })
    return { error: res.error }
  }

  logger.info('Company invite cancelled', { companyId, inviteId })
  return {}
}

// ─── Access Scopes ────────────────────────────────────────────────────────────

export async function adminGetAccessScopes(
  session: CustomSession | null,
  companyId: string
): Promise<{ data: AccessScopeEntity[] } | { error: string }> {
  const res = await performAdminRequest<AccessScopeEntity[]>(
    session,
    `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.accessScopes(companyId)}`
  )

  if ('error' in res) {
    logger.error('Failed to fetch company access scopes', { error: res.error, companyId })
    return { error: res.error }
  }

  const normalized: AccessScopeEntity[] = Array.isArray(res.data)
    ? res.data.flatMap((item) => {
        if (typeof item !== 'object' || item === null || Array.isArray(item)) {
          return []
        }

        const source = item as Record<string, unknown>
        const id = typeof source.id === 'string' ? source.id : typeof source._id === 'string' ? source._id : ''
        const userId = typeof source.userId === 'string' ? source.userId : ''
        const groupId =
          typeof source.groupId === 'string'
            ? source.groupId
            : Array.isArray(source.groupIds) && typeof source.groupIds[0] === 'string'
              ? source.groupIds[0]
              : ''

        if (!id || !userId || !groupId) {
          return []
        }

        return [
          {
            id,
            userId,
            groupId,
            permission:
              typeof source.permission === 'string'
                ? (source.permission as AccessScopeEntity['permission'])
                : 'VIEW_ANALYTICS',
            companyId,
            createdAt: typeof source.createdAt === 'string' ? source.createdAt : '',
          },
        ]
      })
    : []

  return { data: normalized }
}

export async function adminCreateAccessScope(
  session: CustomSession | null,
  companyId: string,
  dto: CreateAccessScopeDto
): Promise<{ data: AccessScopeEntity } | { error: string }> {
  const res = await performAdminRequest<AccessScopeEntity>(
    session,
    `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.accessScopes(companyId)}`,
    { method: 'POST', body: dto as unknown as Record<string, unknown> }
  )

  if ('error' in res) {
    logger.error('Failed to create company access scope', { error: res.error, companyId })
    return { error: res.error }
  }

  logger.info('Company access scope created', { companyId, userId: dto.userId })
  if (typeof res.data !== 'object' || res.data === null || Array.isArray(res.data)) {
    return { error: 'Invalid access scope response' }
  }

  const source = res.data as Record<string, unknown>
  const id = typeof source.id === 'string' ? source.id : typeof source._id === 'string' ? source._id : ''
  const userId = typeof source.userId === 'string' ? source.userId : ''
  const groupId =
    typeof source.groupId === 'string'
      ? source.groupId
      : Array.isArray(source.groupIds) && typeof source.groupIds[0] === 'string'
        ? source.groupIds[0]
        : ''

  if (!id || !userId || !groupId) {
    return { error: 'Invalid access scope response' }
  }

  return {
    data: {
      id,
      userId,
      groupId,
      permission:
        typeof source.permission === 'string'
          ? (source.permission as AccessScopeEntity['permission'])
          : 'VIEW_ANALYTICS',
      companyId,
      createdAt: typeof source.createdAt === 'string' ? source.createdAt : '',
    },
  }
}

export async function adminDeleteAccessScope(
  session: CustomSession | null,
  companyId: string,
  id: string
): Promise<Record<string, never> | { error: string }> {
  const res = await performAdminRequest(session, `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.accessScopeById(companyId, id)}`, {
    method: 'DELETE',
  })

  if ('error' in res) {
    logger.error('Failed to delete company access scope', { error: res.error, companyId, id })
    return { error: res.error }
  }

  logger.info('Company access scope deleted', { companyId, id })
  return {}
}
