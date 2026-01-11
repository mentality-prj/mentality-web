import { apiRequest } from '@/helpers/api-wrapper'
import { logger } from '@/lib/logger'
import { CustomSession } from '@/types/auth'
import { UserTag } from '@/types/tags'

import { APIUrl } from './config'

export async function addUserTag(session: CustomSession | null, tag: UserTag) {
  if (!session?.user) {
    logger.warn('Unauthorized attempt to add user tag (client helper)', { tagKey: tag.key })
    return { error: 'Unauthorized: Login required' }
  }

  const url = `${APIUrl}/user-tags`

  const { data, error } = await apiRequest(session, url, {
    method: 'POST',
    body: { key: tag.key, name: tag.name },
  })

  if (error) {
    logger.error('Failed to add user tag (client helper)', { error, tagKey: tag.key })
    return { error }
  }

  logger.info('User tag added via upstream user-tags endpoint', { tagKey: tag.key })
  return { data }
}

export async function getUserTags(session: CustomSession | null) {
  if (!session?.user) {
    logger.warn('Unauthorized attempt to get user tags (client helper)')
    return { error: 'Unauthorized: Login required' }
  }

  const url = `${APIUrl}/user-tags`
  const { data, error } = await apiRequest(session, url, { method: 'GET' })

  if (error) {
    logger.error('Failed to fetch user tags', { error })
    return { error }
  }

  // Expect upstream to return array of { key, name }
  return { data }
}
