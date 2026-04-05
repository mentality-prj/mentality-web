import { COMPANY_ADMIN_ENDPOINTS, INVITE_ENDPOINTS } from '@/constants/companyEndpoints'
import { extractPaginationTotal } from '@/lib/http'
import { logger } from '@/lib/logger'
import { mapInvite, mapInvites } from '@/mappers/company.mappers'
import { CustomSession } from '@/types/auth'
import { CreateInviteDto, InviteEntity, PaginatedInvites } from '@/types/company'
import { CAN_INVITE_EMPLOYEES } from '@/types/rbac'

import { APIUrl } from './config'
import { performAdminRequest, performAuthRequest } from './genericFetch'

function assertCanInvite(session: CustomSession | null): boolean {
  const role = session?.user?.companyRole
  return !!role && CAN_INVITE_EMPLOYEES.includes(role)
}

export async function createInvite(
  session: CustomSession | null,
  dto: CreateInviteDto
): Promise<{ data: InviteEntity } | { error: string }> {
  if (!assertCanInvite(session)) {
    logger.warn('Unauthorized attempt to create invite')
    return { error: 'Unauthorized: insufficient role' }
  }

  const res = await performAuthRequest<InviteEntity>(session, `${APIUrl}${INVITE_ENDPOINTS.BASE}`, {
    method: 'POST',
    body: dto as unknown as Record<string, unknown>,
  })

  if ('error' in res) {
    logger.error('Failed to create invite', { error: res.error })
    return { error: res.error }
  }

  const mapped = mapInvite(res.data)
  if (!mapped) {
    logger.error('Invalid invite data returned from API')
    return { error: 'Invalid invite data' }
  }
  logger.info('Invite sent')
  return { data: mapped }
}

export async function getInvites(
  session: CustomSession | null,
  page = 1,
  limit = 20
): Promise<{ data: PaginatedInvites } | { error: string }> {
  const url = `${APIUrl}${INVITE_ENDPOINTS.BASE}?page=${page}&limit=${limit}`
  const res = await performAuthRequest<InviteEntity[]>(session, url)

  if ('error' in res) {
    logger.error('Failed to fetch invites', { error: res.error })
    return { error: res.error }
  }

  const items = mapInvites(res.data)
  const total = extractPaginationTotal(res.headers, items.length)
  return { data: { items, total } }
}

export async function resendInvite(
  session: CustomSession | null,
  id: string
): Promise<{ data: InviteEntity } | { error: string }> {
  if (!assertCanInvite(session)) {
    logger.warn('Unauthorized attempt to resend invite')
    return { error: 'Unauthorized: insufficient role' }
  }

  const res = await performAuthRequest<InviteEntity>(session, `${APIUrl}${INVITE_ENDPOINTS.resend(id)}`, {
    method: 'POST',
  })

  if ('error' in res) {
    logger.error('Failed to resend invite', { error: res.error, id })
    return { error: res.error }
  }

  const mapped = mapInvite(res.data)
  if (!mapped) {
    logger.error('Invalid invite data on resend', { id })
    return { error: 'Invalid invite data' }
  }
  logger.info('Invite resent', { id })
  return { data: mapped }
}

export async function cancelInvite(
  session: CustomSession | null,
  id: string
): Promise<{ data: InviteEntity } | { error: string }> {
  if (!assertCanInvite(session)) {
    logger.warn('Unauthorized attempt to cancel invite')
    return { error: 'Unauthorized: insufficient role' }
  }

  const res = await performAuthRequest<InviteEntity>(session, `${APIUrl}${INVITE_ENDPOINTS.byId(id)}`, {
    method: 'DELETE',
  })

  if ('error' in res) {
    logger.error('Failed to cancel invite', { error: res.error, id })
    return { error: res.error }
  }

  const mapped = mapInvite(res.data)
  if (!mapped) {
    logger.error('Invalid invite data on cancel', { id })
    return { error: 'Invalid invite data' }
  }
  logger.info('Invite cancelled', { id })
  return { data: mapped }
}

// ─── Admin-scoped (per-company) variants ──────────────────────────────────────

export async function getInvitesAdmin(
  session: CustomSession | null,
  companyId: string,
  page = 1,
  limit = 20
): Promise<{ data: PaginatedInvites } | { error: string }> {
  const url = `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.invites(companyId, page, limit)}`
  const res = await performAdminRequest<InviteEntity[]>(session, url)
  if ('error' in res) {
    logger.error('Admin: failed to fetch invites', { error: res.error, companyId })
    return { error: res.error }
  }
  const items = mapInvites(res.data)
  const total = extractPaginationTotal(res.headers, items.length)
  return { data: { items, total } }
}

export async function createInviteAdmin(
  session: CustomSession | null,
  companyId: string,
  dto: CreateInviteDto
): Promise<{ data: InviteEntity } | { error: string }> {
  const res = await performAdminRequest<InviteEntity>(
    session,
    `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.inviteBase(companyId)}`,
    { method: 'POST', body: dto as unknown as Record<string, unknown> }
  )
  if ('error' in res) {
    logger.error('Admin: failed to create invite', { error: res.error, companyId })
    return { error: res.error }
  }
  const mapped = mapInvite(res.data)
  if (!mapped) return { error: 'Invalid invite data' }
  logger.info('Admin: invite sent', { companyId })
  return { data: mapped }
}

export async function resendInviteAdmin(
  session: CustomSession | null,
  companyId: string,
  id: string
): Promise<{ data: InviteEntity } | { error: string }> {
  const res = await performAdminRequest<InviteEntity>(
    session,
    `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.inviteResend(companyId, id)}`,
    { method: 'POST' }
  )
  if ('error' in res) {
    logger.error('Admin: failed to resend invite', { error: res.error, companyId, id })
    return { error: res.error }
  }
  const mapped = mapInvite(res.data)
  if (!mapped) return { error: 'Invalid invite data' }
  logger.info('Admin: invite resent', { id, companyId })
  return { data: mapped }
}

export async function cancelInviteAdmin(
  session: CustomSession | null,
  companyId: string,
  id: string
): Promise<{ data: InviteEntity } | { error: string }> {
  const res = await performAdminRequest<InviteEntity>(
    session,
    `${APIUrl}${COMPANY_ADMIN_ENDPOINTS.inviteById(companyId, id)}`,
    { method: 'DELETE' }
  )
  if ('error' in res) {
    logger.error('Admin: failed to cancel invite', { error: res.error, companyId, id })
    return { error: res.error }
  }
  const mapped = mapInvite(res.data)
  if (!mapped) return { error: 'Invalid invite data' }
  logger.info('Admin: invite cancelled', { id, companyId })
  return { data: mapped }
}
