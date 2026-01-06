import { PAGE_SIZE } from '@/constants/pagination'
import { logger } from '@/lib/logger'
import { PaginatedTips, TipEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'
import { SupportedLanguage } from '@/types/languages'
import { Roles } from '@/types/security'

import { APIUrl } from './config'
import { performAdminRequest, performAuthRequest } from './genericFetch'

export async function addTip(session: CustomSession | null, prompt: string, lang: SupportedLanguage) {
  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn('Unauthorized attempt to add tip', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized: Admin role required' }
  }

  const res = await performAdminRequest<TipEntity>(session, `${APIUrl}/tips`, {
    method: 'POST',
    body: { prompt, lang },
  })

  if ('error' in res) {
    logger.error('Failed to add tip', { error: res.error, prompt, lang })
    return { error: res.error }
  }

  logger.info('Tip successfully generated', { lang })
  return { data: res.data }
}

export async function getUnpublishedTips(
  session: CustomSession | null,
  page = 1,
  limit = PAGE_SIZE
): Promise<{ data: PaginatedTips } | { error: string }> {
  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn('Unauthorized attempt to get unpublished tips', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized: Admin role required' }
  }

  const url = `${APIUrl}/tips/unpublished?page=${page}&limit=${limit}`
  const res = await performAdminRequest<TipEntity[]>(session, url, { method: 'GET' })

  if ('error' in res) {
    logger.error('Failed to get unpublished tips', { error: res.error })
    return { error: res.error }
  }

  const items = Array.isArray(res.data) ? res.data : []
  const headerTotal = res.headers?.get('X-Total-Count') ?? res.headers?.get('x-total-count')
  const total = headerTotal ? parseInt(headerTotal, 10) || items.length : items.length
  logger.info('Unpublished tips retrieved', { count: items.length, total })
  return { data: { items, total } }
}

export async function getTips(
  session: CustomSession | null,
  page = 1,
  limit = PAGE_SIZE
): Promise<{ data: PaginatedTips } | { error: string }> {
  const url = `${APIUrl}/tips?page=${page}&limit=${limit}`
  const res = await performAuthRequest<TipEntity[]>(session, url, { method: 'GET' })

  if ('error' in res) {
    logger.error('Failed to get tips', { error: res.error })
    return { error: res.error }
  }

  const items = Array.isArray(res.data) ? res.data : []
  const headerTotal = res.headers?.get('X-Total-Count') ?? res.headers?.get('x-total-count')
  const total = headerTotal ? parseInt(headerTotal, 10) || items.length : items.length
  logger.info('Tips retrieved', { count: items.length, total })
  return { data: { items, total } }
}

export async function publishTip(session: CustomSession | null, id: string) {
  const res = await performAdminRequest<TipEntity>(session, `${APIUrl}/tips/${id}`, {
    method: 'PATCH',
    body: { isPublished: true },
  })

  if ('error' in res) {
    logger.error('Failed to publish tip', { error: res.error, id })
    return { error: res.error }
  }

  logger.info('Tip published', { id })
  return { data: res.data }
}

export async function deleteTip(session: CustomSession | null, id: string) {
  const res = await performAdminRequest<TipEntity>(session, `${APIUrl}/tips/${id}`, { method: 'DELETE' })

  if ('error' in res) {
    logger.error('Failed to delete tip', { error: res.error, id })
    return { error: res.error }
  }

  logger.info('Tip deleted', { id })
  return { data: res.data }
}

export async function updateTip(
  session: CustomSession | null,
  id: string,
  patch: Partial<Pick<TipEntity, 'translations' | 'tags' | 'isPublished'>>
) {
  const res = await performAdminRequest<TipEntity>(session, `${APIUrl}/tips/${id}`, {
    method: 'PATCH',
    body: patch,
  })

  if ('error' in res) {
    logger.error('Failed to update tip', { error: res.error, id })
    return { error: res.error }
  }

  logger.info('Tip updated', { id })
  return { data: res.data }
}
