import { apiRequestWithAuth } from '@/helpers/apiRequestWithAuth'
import { logger } from '@/lib/logger'
import { TagEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'
import { Roles } from '@/types/security'
import { Tag } from '@/types/tags'

import { APIUrl } from './config'

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
