import { logger } from '@/lib/logger'
import type { CustomSession } from '@/types/auth'
import type { UserTag } from '@/types/tags'

import { APIUrl } from './config'
import { performAuthRequest } from './genericFetch'

function getUserTagsEndpoint() {
  return `${APIUrl.trim().replace(/\/+$/, '')}/user-tags`
}

export async function addUserTag(session: CustomSession | null, tag: UserTag) {
  if (!session?.user) {
    logger.warn('Unauthorized attempt to add user tag (client helper)', { tagKey: tag.key })
    return { error: 'Unauthorized: Login required' }
  }

  const result = await performAuthRequest<UserTag>(session, getUserTagsEndpoint(), {
    method: 'POST',
    body: { key: tag.key, name: tag.name },
  })

  if ('error' in result) {
    logger.error('Failed to add user tag (client helper)', { error: result.error, tagKey: tag.key })
    return { error: result.error }
  }

  logger.info('User tag added via upstream user-tags endpoint', { tagKey: tag.key })

  return { data: result.data }
}

export async function getUserTags(session: CustomSession | null) {
  if (!session?.user) {
    logger.warn('Unauthorized attempt to get user tags (client helper)')
    return { error: 'Unauthorized: Login required' }
  }

  const result = await performAuthRequest<UserTag[]>(session, getUserTagsEndpoint(), { method: 'GET' })

  if ('error' in result) {
    logger.error('Failed to fetch user tags', { error: result.error })
    return { error: result.error }
  }

  return { data: result.data }
}
