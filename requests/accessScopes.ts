import { ACCESS_SCOPE_ENDPOINTS, COMPANY_ADMIN_ENDPOINTS } from '@/constants/companyEndpoints'
import { logger } from '@/lib/logger'
import { CustomSession } from '@/types/auth'
import { AccessScopeEntity, CreateAccessScopeDto } from '@/types/company'
import { CAN_ASSIGN_MANAGERS } from '@/types/rbac'

import { APIUrl } from './config'
import { performAdminRequest, performAuthRequest } from './genericFetch'

function assertCanAssign(session: CustomSession | null): boolean {
  const role = session?.user?.companyRole
  return !!role && CAN_ASSIGN_MANAGERS.includes(role)
}

function normalizeAccessScope(value: unknown, companyId?: string): AccessScopeEntity | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null
  }

  const source = value as Record<string, unknown>
  const id = typeof source.id === 'string' ? source.id : typeof source._id === 'string' ? source._id : ''
  const userId = typeof source.userId === 'string' ? source.userId : ''
  const groupId =
    typeof source.groupId === 'string'
      ? source.groupId
      : Array.isArray(source.groupIds) && typeof source.groupIds[0] === 'string'
        ? source.groupIds[0]
        : ''

  if (!id || !userId || !groupId) {
    return null
  }

  const permission =
    typeof source.permission === 'string'
      ? (source.permission as AccessScopeEntity['permission'])
      : source.canViewAnalytics === true
        ? 'VIEW_ANALYTICS'
        : 'VIEW_ANALYTICS'

  return {
    id,
    userId,
    groupId,
    permission,
    companyId:
      typeof source.companyId === 'string' ? source.companyId : typeof companyId === 'string' ? companyId : undefined,
    createdAt: typeof source.createdAt === 'string' ? source.createdAt : '',
  }
}

function normalizeAccessScopes(value: unknown, companyId?: string): AccessScopeEntity[] {
  return Array.isArray(value)
    ? value
        .map((item) => normalizeAccessScope(item, companyId))
        .filter((item): item is AccessScopeEntity => item !== null)
    : []
}

export async function createAccessScope(
  session: CustomSession | null,
  companyId: string,
  dto: CreateAccessScopeDto
): Promise<{ data: AccessScopeEntity } | { error: string }> {
  if (!assertCanAssign(session)) {
    logger.warn('Unauthorized attempt to create access scope', { userId: session?.user?.email })
    return { error: 'Unauthorized: insufficient role' }
  }

  const res = await performAuthRequest<AccessScopeEntity>(
    session,
    `${APIUrl}${ACCESS_SCOPE_ENDPOINTS.base(companyId)}`,
    {
      method: 'POST',
      body: dto as unknown as Record<string, unknown>,
    }
  )

  if ('error' in res) {
    logger.error('Failed to create access scope', { error: res.error })
    return { error: res.error }
  }

  logger.info('Access scope created', { userId: dto.userId })
  const normalized = normalizeAccessScope(res.data, companyId)
  if (!normalized) {
    return { error: 'Invalid access scope response' }
  }

  return { data: normalized }
}

export async function deleteAccessScope(
  session: CustomSession | null,
  companyId: string,
  id: string
): Promise<Record<string, never> | { error: string }> {
  if (!assertCanAssign(session)) {
    logger.warn('Unauthorized attempt to delete access scope', { userId: session?.user?.email })
    return { error: 'Unauthorized: insufficient role' }
  }

  const res = await performAuthRequest<AccessScopeEntity>(
    session,
    `${APIUrl}${ACCESS_SCOPE_ENDPOINTS.byId(companyId, id)}`,
    {
      method: 'DELETE',
    }
  )

  if ('error' in res) {
    logger.error('Failed to delete access scope', { error: res.error, id })
    return { error: res.error }
  }

  logger.info('Access scope deleted', { id })
  return {}
}

export async function getAccessScopes(
  session: CustomSession | null,
  companyId: string
): Promise<{ data: AccessScopeEntity[] } | { error: string }> {
  const res = await performAuthRequest<AccessScopeEntity[]>(
    session,
    `${APIUrl}${ACCESS_SCOPE_ENDPOINTS.base(companyId)}`
  )

  if ('error' in res) {
    logger.error('Failed to fetch access scopes', { error: res.error })
    return { error: res.error }
  }

  return { data: normalizeAccessScopes(res.data, companyId) }
}

// ─── Admin-scoped (per-company) variants ──────────────────────────────────────

export async function getAccessScopesAdmin(
  session: CustomSession | null,
  companyId: string
): Promise<{ data: AccessScopeEntity[] } | { error: string }> {
  const res = await performAdminRequest<AccessScopeEntity[]>(
    session,
    `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.accessScopes(companyId)}`
  )
  if ('error' in res) {
    logger.error('Admin: failed to fetch access scopes', { error: res.error, companyId })
    return { error: res.error }
  }
  return { data: normalizeAccessScopes(res.data, companyId) }
}

export async function createAccessScopeAdmin(
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
    logger.error('Admin: failed to create access scope', { error: res.error, companyId })
    return { error: res.error }
  }
  logger.info('Admin: access scope created', { userId: dto.userId, companyId })
  const normalized = normalizeAccessScope(res.data, companyId)
  if (!normalized) {
    return { error: 'Invalid access scope response' }
  }

  return { data: normalized }
}

export async function deleteAccessScopeAdmin(
  session: CustomSession | null,
  companyId: string,
  id: string
): Promise<Record<string, never> | { error: string }> {
  const res = await performAdminRequest<AccessScopeEntity>(
    session,
    `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.accessScopeById(companyId, id)}`,
    { method: 'DELETE' }
  )
  if ('error' in res) {
    logger.error('Admin: failed to delete access scope', { error: res.error, companyId, id })
    return { error: res.error }
  }
  logger.info('Admin: access scope deleted', { id, companyId })
  return {}
}
