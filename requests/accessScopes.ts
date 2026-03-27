import { ACCESS_SCOPE_ENDPOINTS } from '@/constants/companyEndpoints'
import { logger } from '@/lib/logger'
import { CustomSession } from '@/types/auth'
import { AccessScopeEntity, CreateAccessScopeDto } from '@/types/company'
import { CAN_ASSIGN_MANAGERS } from '@/types/rbac'

import { APIUrl } from './config'
import { performAuthRequest } from './genericFetch'

function assertCanAssign(session: CustomSession | null): boolean {
  const role = session?.user?.companyRole
  return !!role && CAN_ASSIGN_MANAGERS.includes(role)
}

export async function createAccessScope(
  session: CustomSession | null,
  dto: CreateAccessScopeDto
): Promise<{ data: AccessScopeEntity } | { error: string }> {
  if (!assertCanAssign(session)) {
    logger.warn('Unauthorized attempt to create access scope', { userId: session?.user?.email })
    return { error: 'Unauthorized: insufficient role' }
  }

  const res = await performAuthRequest<AccessScopeEntity>(session, `${APIUrl}${ACCESS_SCOPE_ENDPOINTS.BASE}`, {
    method: 'POST',
    body: dto as unknown as Record<string, unknown>,
  })

  if ('error' in res) {
    logger.error('Failed to create access scope', { error: res.error })
    return { error: res.error }
  }

  logger.info('Access scope created', { userId: dto.userId })
  return { data: res.data as AccessScopeEntity }
}

export async function deleteAccessScope(
  session: CustomSession | null,
  id: string
): Promise<{ data: AccessScopeEntity } | { error: string }> {
  if (!assertCanAssign(session)) {
    logger.warn('Unauthorized attempt to delete access scope', { userId: session?.user?.email })
    return { error: 'Unauthorized: insufficient role' }
  }

  const res = await performAuthRequest<AccessScopeEntity>(session, `${APIUrl}${ACCESS_SCOPE_ENDPOINTS.byId(id)}`, {
    method: 'DELETE',
  })

  if ('error' in res) {
    logger.error('Failed to delete access scope', { error: res.error, id })
    return { error: res.error }
  }

  logger.info('Access scope deleted', { id })
  return { data: res.data as AccessScopeEntity }
}

export async function getAccessScopes(
  session: CustomSession | null
): Promise<{ data: AccessScopeEntity[] } | { error: string }> {
  const res = await performAuthRequest<AccessScopeEntity[]>(session, `${APIUrl}${ACCESS_SCOPE_ENDPOINTS.BASE}`)

  if ('error' in res) {
    logger.error('Failed to fetch access scopes', { error: res.error })
    return { error: res.error }
  }

  return { data: Array.isArray(res.data) ? res.data : [] }
}
