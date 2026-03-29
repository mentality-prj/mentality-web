import { GROUP_ENDPOINTS } from '@/constants/companyEndpoints'
import { logger } from '@/lib/logger'
import { mapGroup, mapGroups } from '@/mappers/group.mappers'
import { CustomSession } from '@/types/auth'
import { CreateGroupDto, GroupEntity, UpdateGroupDto } from '@/types/company'
import { CAN_MANAGE_GROUPS } from '@/types/rbac'

import { APIUrl } from './config'
import { performAuthRequest } from './genericFetch'

function assertCanManageGroups(session: CustomSession | null): boolean {
  const role = session?.user?.companyRole
  return !!role && CAN_MANAGE_GROUPS.includes(role)
}

export async function getGroups(session: CustomSession | null): Promise<{ data: GroupEntity[] } | { error: string }> {
  const res = await performAuthRequest<GroupEntity[]>(session, `${APIUrl}${GROUP_ENDPOINTS.BASE}`)

  if ('error' in res) {
    logger.error('Failed to fetch groups', { error: res.error })
    return { error: res.error }
  }

  return { data: mapGroups(res.data) }
}

export async function getAccessibleGroups(
  session: CustomSession | null
): Promise<{ data: GroupEntity[] } | { error: string }> {
  const res = await performAuthRequest<GroupEntity[]>(session, `${APIUrl}${GROUP_ENDPOINTS.accessible}`)

  if ('error' in res) {
    logger.error('Failed to fetch accessible groups', { error: res.error })
    return { error: res.error }
  }

  return { data: mapGroups(res.data) }
}

export async function createGroup(
  session: CustomSession | null,
  dto: CreateGroupDto
): Promise<{ data: GroupEntity } | { error: string }> {
  if (!assertCanManageGroups(session)) {
    logger.warn('Unauthorized attempt to create group', { userId: session?.user?.email })
    return { error: 'Unauthorized: insufficient role' }
  }

  const res = await performAuthRequest<GroupEntity>(session, `${APIUrl}${GROUP_ENDPOINTS.BASE}`, {
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
  id: string,
  dto: UpdateGroupDto
): Promise<{ data: GroupEntity } | { error: string }> {
  if (!assertCanManageGroups(session)) {
    logger.warn('Unauthorized attempt to update group', { userId: session?.user?.email })
    return { error: 'Unauthorized: insufficient role' }
  }

  const res = await performAuthRequest<GroupEntity>(session, `${APIUrl}${GROUP_ENDPOINTS.byId(id)}`, {
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
  id: string
): Promise<{ data: GroupEntity } | { error: string }> {
  if (!assertCanManageGroups(session)) {
    logger.warn('Unauthorized attempt to delete group', { userId: session?.user?.email })
    return { error: 'Unauthorized: insufficient role' }
  }

  const res = await performAuthRequest<GroupEntity>(session, `${APIUrl}${GROUP_ENDPOINTS.byId(id)}`, {
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
