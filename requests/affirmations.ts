import { ADMIN_PAGE_SIZE } from '@/constants/pagination'
import { extractPaginationTotal } from '@/lib/http'
import { logger } from '@/lib/logger'
import { AffirmationEntity, PaginatedAffirmations } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'
import { SupportedLanguage } from '@/types/languages'
import { Roles } from '@/types/security'

import { APIUrl } from './config'
import { performAdminRequest, performAuthRequest } from './genericFetch'

export async function addAffirmation(session: CustomSession | null, prompt: string, lang: SupportedLanguage) {
  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn('Unauthorized attempt to add affirmation', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized: Admin role required' }
  }

  const res = await performAdminRequest<AffirmationEntity>(session, `${APIUrl}/affirmations`, {
    method: 'POST',
    body: { prompt },
  })

  if ('error' in res) {
    logger.error('Failed to add affirmation', { error: res.error, prompt, lang })
    return { error: res.error }
  }

  logger.info('Affirmation successfully generated', { lang })
  return { data: res.data }
}

export async function getUnpublishedAffirmations(
  session: CustomSession | null,
  page = 1,
  limit = ADMIN_PAGE_SIZE
): Promise<{ data: PaginatedAffirmations } | { error: string }> {
  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn('Unauthorized attempt to get unpublished affirmations', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized: Admin role required' }
  }

  const url = `${APIUrl}/affirmations/unpublished?page=${page}&limit=${limit}`
  const res = await performAdminRequest<AffirmationEntity[]>(session, url, { method: 'GET' })

  if ('error' in res) {
    logger.error('Failed to get unpublished affirmations', { error: res.error })
    return { error: res.error }
  }

  const items: AffirmationEntity[] = Array.isArray(res.data) ? res.data : []
  const total = extractPaginationTotal(res.headers, items.length)
  logger.info('Unpublished affirmations retrieved', { count: items.length, total })
  return { data: { items, total } }
}

export async function getAffirmations(
  session: CustomSession | null,
  page = 1,
  limit = ADMIN_PAGE_SIZE
): Promise<{ data: PaginatedAffirmations } | { error: string }> {
  const url = `${APIUrl}/affirmations?page=${page}&limit=${limit}`

  if (!session || !session.user) {
    logger.warn('Unauthorized attempt to get affirmations (no session)')
    return { error: 'Unauthorized: authentication required' }
  }

  const res = await performAuthRequest<AffirmationEntity[]>(session, url, { method: 'GET' })

  if ('error' in res) {
    logger.error('Failed to get affirmations', { error: res.error, page, limit })
    return { error: res.error }
  }

  const items: AffirmationEntity[] = Array.isArray(res.data) ? res.data : []
  const total = extractPaginationTotal(res.headers, items.length)
  return { data: { items, total } }
}

export async function getRandomAffirmation(
  session: CustomSession | null
): Promise<{ data: AffirmationEntity } | { error: string }> {
  const url = `${APIUrl}/affirmations/random`

  if (!session || !session.user) {
    logger.warn('Unauthorized attempt to get random affirmation (no session)')
    return { error: 'Unauthorized: authentication required' }
  }

  const res = await performAuthRequest<AffirmationEntity>(session, url, { method: 'GET' })

  if ('error' in res) {
    logger.error('Failed to get random affirmation', { error: res.error })
    return { error: res.error }
  }

  if (!res.data) {
    logger.warn('No random affirmation returned')
    return { error: 'No affirmation available' }
  }

  return { data: res.data }
}

export async function publishAffirmation(session: CustomSession | null, id: string) {
  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn('Unauthorized attempt to publish affirmation', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized: Admin role required' }
  }

  const res = await performAdminRequest<AffirmationEntity>(session, `${APIUrl}/affirmations/${id}`, {
    method: 'PATCH',
    body: { isPublished: true },
  })

  if ('error' in res) {
    logger.error('Failed to publish affirmation', { error: res.error, id })
    return { error: res.error }
  }

  logger.info('Affirmation published', { id })
  return { data: res.data }
}

export async function deleteAffirmation(session: CustomSession | null, id: string) {
  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn('Unauthorized attempt to delete affirmation', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized: Admin role required' }
  }

  const res = await performAdminRequest<AffirmationEntity>(session, `${APIUrl}/affirmations/${id}`, {
    method: 'DELETE',
  })

  if ('error' in res) {
    logger.error('Failed to delete affirmation', { error: res.error, id })
    return { error: res.error }
  }

  logger.info('Affirmation deleted', { id })
  return { data: res.data }
}

// OpenAPI-aligned endpoints
export async function generateAffirmationImage(session: CustomSession | null, prompt: string) {
  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn('Unauthorized attempt to generate affirmation image', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized: Admin role required' }
  }

  const res = await performAdminRequest<{ imageUrl: string }>(session, `${APIUrl}/affirmations/generate-image`, {
    method: 'POST',
    body: { prompt },
  })

  if ('error' in res) {
    logger.error('Failed to generate affirmation image', { error: res.error })
    return { error: res.error }
  }

  logger.info('Affirmation image generated')
  return { data: res.data }
}

export async function publishAffirmationById(session: CustomSession | null, id: string) {
  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn('Unauthorized attempt to publish affirmation by id', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized: Admin role required' }
  }

  const res = await performAdminRequest<AffirmationEntity>(session, `${APIUrl}/affirmations/${id}/publish`, {
    method: 'PATCH',
  })

  if ('error' in res) {
    logger.error('Failed to publish affirmation by id', { error: res.error, id })
    return { error: res.error }
  }

  logger.info('Affirmation published by id', { id })
  return { data: res.data }
}

export async function updateAffirmation(
  session: CustomSession | null,
  id: string,
  patch: Partial<Pick<AffirmationEntity, 'translations' | 'imageUrl' | 'isPublished'>>
) {
  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn('Unauthorized attempt to update affirmation', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized: Admin role required' }
  }

  const res = await performAdminRequest<AffirmationEntity>(session, `${APIUrl}/affirmations/${id}`, {
    method: 'PATCH',
    body: patch as Record<string, unknown>,
  })

  if ('error' in res) {
    logger.error('Failed to update affirmation', { error: res.error, id })
    return { error: res.error }
  }

  logger.info('Affirmation updated', { id })
  return { data: res.data }
}
