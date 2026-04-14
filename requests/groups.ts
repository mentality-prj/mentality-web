import { COMPANY_ADMIN_ENDPOINTS, GROUP_ENDPOINTS } from '@/constants/companyEndpoints'
import { logger } from '@/lib/logger'
import { mapGroup, mapGroups } from '@/mappers/group.mappers'
import { CustomSession } from '@/types/auth'
import { CreateGroupDto, GroupEntity, UpdateGroupDto } from '@/types/company'
import { CAN_MANAGE_GROUPS } from '@/types/rbac'

import { APIUrl } from './config'
import { performAdminRequest, performAuthRequest } from './genericFetch'

function assertCanManageGroups(session: CustomSession | null): boolean {
  const role = session?.user?.companyRole
  return !!role && CAN_MANAGE_GROUPS.includes(role)
}

export async function getGroups(
  session: CustomSession | null,
  companyId: string
): Promise<{ data: GroupEntity[] } | { error: string }> {
  const res = await performAuthRequest<GroupEntity[]>(session, `${APIUrl}${GROUP_ENDPOINTS.byCompany(companyId)}`)

  if ('error' in res) {
    logger.error('Failed to fetch groups', { error: res.error })
    return { error: res.error }
  }

  return { data: mapGroups(res.data) }
}

export async function createGroup(
  session: CustomSession | null,
  companyId: string,
  dto: CreateGroupDto
): Promise<{ data: GroupEntity } | { error: string }> {
  if (!assertCanManageGroups(session)) {
    logger.warn('Unauthorized attempt to create group', { userId: session?.user?.email })
    return { error: 'Unauthorized: insufficient role' }
  }

  const res = await performAuthRequest<GroupEntity>(session, `${APIUrl}${GROUP_ENDPOINTS.byCompany(companyId)}`, {
    method: 'POST',
    body: dto as unknown as Record<string, unknown>,
  })

  if ('error' in res) {
    logger.error('Failed to create group', { error: res.error })
    return { error: res.error }
  }

  logger.info('Group created', { name: dto.name })
  const mapped = mapGroup(res.data)
  if (!mapped) {
    logger.error('Invalid group data returned from API', { name: dto.name })
    return { error: 'Invalid group data' }
  }
  return { data: mapped }
}

export async function updateGroup(
  session: CustomSession | null,
  companyId: string,
  id: string,
  dto: UpdateGroupDto
): Promise<{ data: GroupEntity } | { error: string }> {
  if (!assertCanManageGroups(session)) {
    logger.warn('Unauthorized attempt to update group', { userId: session?.user?.email })
    return { error: 'Unauthorized: insufficient role' }
  }

  const res = await performAuthRequest<GroupEntity>(session, `${APIUrl}${GROUP_ENDPOINTS.byId(companyId, id)}`, {
    method: 'PATCH',
    body: dto as unknown as Record<string, unknown>,
  })

  if ('error' in res) {
    logger.error('Failed to update group', { error: res.error, id })
    return { error: res.error }
  }

  logger.info('Group updated', { id })
  const mapped = mapGroup(res.data)
  if (!mapped) {
    logger.error('Invalid group data returned from API', { id })
    return { error: 'Invalid group data' }
  }
  return { data: mapped }
}

export async function deleteGroup(
  session: CustomSession | null,
  companyId: string,
  id: string
): Promise<{ data: GroupEntity } | { error: string }> {
  if (!assertCanManageGroups(session)) {
    logger.warn('Unauthorized attempt to delete group', { userId: session?.user?.email })
    return { error: 'Unauthorized: insufficient role' }
  }

  const res = await performAuthRequest<GroupEntity>(session, `${APIUrl}${GROUP_ENDPOINTS.byId(companyId, id)}`, {
    method: 'DELETE',
  })

  if ('error' in res) {
    logger.error('Failed to delete group', { error: res.error, id })
    return { error: res.error }
  }

  logger.info('Group deleted', { id })
  const mapped = mapGroup(res.data)
  if (!mapped) {
    logger.error('Invalid group data returned from API', { id })
    return { error: 'Invalid group data' }
  }
  return { data: mapped }
}

// ─── Admin-scoped (per-company) variants ──────────────────────────────────────

export async function getGroupsAdmin(
  session: CustomSession | null,
  companyId: string
): Promise<{ data: GroupEntity[] } | { error: string }> {
  const res = await performAdminRequest<GroupEntity[]>(session, `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.groups(companyId)}`)
  if ('error' in res) {
    logger.error('Admin: failed to fetch groups', { error: res.error, companyId })
    return { error: res.error }
  }
  return { data: mapGroups(res.data) }
}

export async function createGroupAdmin(
  session: CustomSession | null,
  companyId: string,
  dto: CreateGroupDto
): Promise<{ data: GroupEntity } | { error: string }> {
  const res = await performAdminRequest<GroupEntity>(session, `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.groups(companyId)}`, {
    method: 'POST',
    body: dto as unknown as Record<string, unknown>,
  })
  if ('error' in res) {
    logger.error('Admin: failed to create group', { error: res.error, companyId })
    return { error: res.error }
  }
  logger.info('Admin: group created', { name: dto.name, companyId })
  const mapped = mapGroup(res.data)
  if (!mapped) return { error: 'Invalid group data' }
  return { data: mapped }
}

export async function updateGroupAdmin(
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
    logger.error('Admin: failed to update group', { error: res.error, companyId, id })
    return { error: res.error }
  }
  logger.info('Admin: group updated', { id, companyId })
  const mapped = mapGroup(res.data)
  if (!mapped) return { error: 'Invalid group data' }
  return { data: mapped }
}

export async function deleteGroupAdmin(
  session: CustomSession | null,
  companyId: string,
  id: string
): Promise<{ data: GroupEntity } | { error: string }> {
  const res = await performAdminRequest<GroupEntity>(
    session,
    `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.groupById(companyId, id)}`,
    { method: 'DELETE' }
  )
  if ('error' in res) {
    logger.error('Admin: failed to delete group', { error: res.error, companyId, id })
    return { error: res.error }
  }
  logger.info('Admin: group deleted', { id, companyId })
  const mapped = mapGroup(res.data)
  if (!mapped) return { error: 'Invalid group data' }
  return { data: mapped }
}
