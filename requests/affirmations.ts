import axios, { AxiosError } from 'axios'

import { AFFIRMATIONS_PAGE_SIZE } from '@/constants/pagination'
import { logger } from '@/lib/logger'
import { AffirmationEntity, PaginatedAffirmations } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'
import { SupportedLanguage } from '@/types/languages'
import { Roles } from '@/types/security'

import { APIUrl } from './config'

export async function addAffirmation(session: CustomSession | null, prompt: string, lang: SupportedLanguage) {
  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn('Unauthorized attempt to add affirmation', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized: Admin role required' }
  }

  try {
    const token = session.OAuthToken
    const resp = await axios.post<AffirmationEntity>(
      `${APIUrl}/affirmations`,
      { prompt },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    logger.info('Affirmation successfully generated', { lang })
    return { data: resp.data }
  } catch (err) {
    const axiosErr = err as AxiosError<unknown>
    logger.error('Failed to add affirmation', { error: axiosErr, prompt, lang })
    const message =
      axiosErr.response &&
      typeof axiosErr.response.data === 'object' &&
      'message' in (axiosErr.response.data as Record<string, unknown>)
        ? String((axiosErr.response!.data as Record<string, unknown>).message)
        : axiosErr.message || 'Request failed'
    return { error: message }
  }
}

export async function getUnpublishedAffirmations(
  session: CustomSession | null,
  page = 1,
  limit = AFFIRMATIONS_PAGE_SIZE
): Promise<{ data: PaginatedAffirmations } | { error: string }> {
  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn('Unauthorized attempt to get unpublished affirmations', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized: Admin role required' }
  }

  try {
    const token = session.OAuthToken
    const url = `${APIUrl}/affirmations/unpublished?page=${page}&limit=${limit}`
    const resp = await axios.get<AffirmationEntity[]>(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const items: AffirmationEntity[] = Array.isArray(resp.data) ? resp.data : []
    const totalHeader = resp.headers && (resp.headers['x-total-count'] || resp.headers['X-Total-Count'])
    const total = totalHeader ? parseInt(String(totalHeader), 10) || items.length : items.length
    logger.info('Unpublished affirmations retrieved', { count: items.length, total })
    return { data: { items, total } }
  } catch (err) {
    const axiosErr = err as AxiosError<unknown>
    logger.error('Failed to get unpublished affirmations', { error: axiosErr })
    const message =
      axiosErr.response &&
      typeof axiosErr.response.data === 'object' &&
      'message' in (axiosErr.response.data as Record<string, unknown>)
        ? String((axiosErr.response!.data as Record<string, unknown>).message)
        : axiosErr.message || 'Request failed'
    return { error: message }
  }
}

export async function getAffirmations(
  session: CustomSession | null,
  page = 1,
  limit = AFFIRMATIONS_PAGE_SIZE
): Promise<{ data: PaginatedAffirmations } | { error: string }> {
  const url = `${APIUrl}/affirmations?page=${page}&limit=${limit}`

  // This endpoint requires authentication: do not allow public access
  if (!session || !session.user) {
    logger.warn('Unauthorized attempt to get affirmations (no session)')
    return { error: 'Unauthorized: authentication required' }
  }

  try {
    const token = session.OAuthToken
    const resp = await axios.get<AffirmationEntity[]>(url, { headers: { Authorization: `Bearer ${token}` } })
    const items: AffirmationEntity[] = Array.isArray(resp.data) ? resp.data : []
    const totalHeader = resp.headers && (resp.headers['x-total-count'] || resp.headers['X-Total-Count'])
    const total = totalHeader ? parseInt(String(totalHeader), 10) || items.length : items.length

    return { data: { items, total } }
  } catch (err) {
    const axiosErr = err as AxiosError<unknown>
    logger.error('Failed to get affirmations', { error: axiosErr, page, limit })
    const message =
      axiosErr.response &&
      typeof axiosErr.response.data === 'object' &&
      'message' in (axiosErr.response.data as Record<string, unknown>)
        ? String((axiosErr.response!.data as Record<string, unknown>).message)
        : axiosErr.message || 'Request failed'
    return { error: message }
  }
}

export async function publishAffirmation(session: CustomSession | null, id: string) {
  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn('Unauthorized attempt to publish affirmation', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized: Admin role required' }
  }

  try {
    const token = session.OAuthToken
    const resp = await axios.patch<AffirmationEntity>(
      `${APIUrl}/affirmations/${id}`,
      { isPublished: true },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    logger.info('Affirmation published', { id })
    return { data: resp.data }
  } catch (err) {
    const axiosErr = err as AxiosError<unknown>
    logger.error('Failed to publish affirmation', { error: axiosErr, id })
    const message =
      axiosErr.response &&
      typeof axiosErr.response.data === 'object' &&
      'message' in (axiosErr.response.data as Record<string, unknown>)
        ? String((axiosErr.response!.data as Record<string, unknown>).message)
        : axiosErr.message || 'Request failed'
    return { error: message }
  }
}

export async function deleteAffirmation(session: CustomSession | null, id: string) {
  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn('Unauthorized attempt to delete affirmation', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized: Admin role required' }
  }

  try {
    const token = session.OAuthToken
    const resp = await axios.delete<AffirmationEntity>(`${APIUrl}/affirmations/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    logger.info('Affirmation deleted', { id })
    return { data: resp.data }
  } catch (err) {
    const axiosErr = err as AxiosError<unknown>
    logger.error('Failed to delete affirmation', { error: axiosErr, id })
    const message =
      axiosErr.response &&
      typeof axiosErr.response.data === 'object' &&
      'message' in (axiosErr.response.data as Record<string, unknown>)
        ? String((axiosErr.response!.data as Record<string, unknown>).message)
        : axiosErr.message || 'Request failed'
    return { error: message }
  }
}
