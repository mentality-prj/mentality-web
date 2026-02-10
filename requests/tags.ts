import { apiRequestWithAuth } from '@/helpers/api-request-with-auth'
import { logger } from '@/lib/logger'
import { TagEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'
import { Roles } from '@/types/security'
import { AdminTag, Tag, UserTag } from '@/types/tags'

import { APIUrl } from './config'
import { performAdminRequest } from './genericFetch'

export async function addTag(session: CustomSession | null, tag: AdminTag | UserTag) {
  const { key } = tag
  // Narrow to possible fields
  const translations = (tag as AdminTag).translations
  const name = (tag as UserTag).name

  // If this is a user-created tag (has `name`), require only an authenticated user.
  if (typeof name === 'string') {
    if (!session?.user) {
      logger.warn('Unauthorized attempt to add tag', {
        userId: session?.user?.email,
        tagKey: key,
      })
      return { error: 'Unauthorized: Login required' }
    }
  } else {
    // Admin-created tag requires admin role
    if (!session?.user || session.user.role !== Roles.ADMIN) {
      logger.warn('Unauthorized attempt to add tag', {
        userId: session?.user?.email,
        tagKey: key,
      })
      return { error: 'Unauthorized: Admin role required' }
    }
  }

  // If `name` is provided (user-created tag), send { key, name }.
  // Otherwise send `translations` as before for admin-managed localized tags.
  const body: Record<string, unknown> = name ? { key, name } : { key, translations }

  // Use a dedicated endpoint for user-created tags so backend can handle them separately
  const endpoint = name ? `${APIUrl}/user-tags` : `${APIUrl}/tags`

  const { data, error } = await apiRequestWithAuth<TagEntity>(session, endpoint, {
    method: 'POST',
    body,
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
