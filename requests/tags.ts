import { apiRequestWithAuth } from '@/helpers/apiRequestWithAuth'
import { logger } from '@/lib/logger'
import { TagEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'
import { Roles } from '@/types/security'
import { Tag } from '@/types/tags'

import { APIUrl } from './config'
import { performAdminRequest } from './genericFetch'

export async function addTag(session: CustomSession | null, tag: Tag) {
  const { key, translations } = tag

  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn('Unauthorized attempt to add tag', {
      userId: session?.user?.email,
      role: session?.user?.role,
      tagKey: key,
    })
    return { error: 'Unauthorized: Admin role required' }
  }

  const { data, error } = await apiRequestWithAuth<TagEntity>(session, `${APIUrl}/tags`, {
    method: 'POST',
    body: { key, translations },
  })

  if (error) {
    logger.error('Failed to add tag', { error, tagKey: key })
    return {
      error:
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : String(error),
    }
  }

  logger.info('Tag successfully added', { tagKey: key })
  return { data }
}

export async function getTags(session: CustomSession | null) {
  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn('Unauthorized attempt to get tags', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized: Admin role required' }
  }

  const { data, error } = await apiRequestWithAuth<TagEntity[]>(session, `${APIUrl}/tags`, {
    method: 'GET',
  })

  if (error) {
    logger.error('Failed to get tags', { error })
    return {
      error:
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : String(error),
    }
  }

  logger.info('Tags retrieved', { count: Array.isArray(data) ? data.length : 0 })
  return { data }
}

export async function updateTag(
  session: CustomSession | null,
  id: string,
  patch: Partial<Pick<TagEntity, 'key' | 'translations'>>
) {
  const res = await performAdminRequest<TagEntity>(session, `${APIUrl}/tags/${id}`, {
    method: 'PATCH',
    body: patch,
  })

  if ('error' in res) {
    logger.error('Failed to update tag', { error: res.error, id })
    return { error: res.error }
  }

  logger.info('Tag updated', { id })
  return { data: res.data }
}

export async function deleteTag(session: CustomSession | null, id: string) {
  const res = await performAdminRequest<TagEntity>(session, `${APIUrl}/tags/${id}`, { method: 'DELETE' })

  if ('error' in res) {
    logger.error('Failed to delete tag', { error: res.error, id })
    return { error: res.error }
  }

  logger.info('Tag deleted', { id })
  return { data: res.data }
}
