import { apiRequestWithAuth } from '@/helpers/api-request-with-auth'
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

  const { data, error } = await apiRequestWithAuth(session, url, {
    method: 'POST',
    body: { key: tag.key, name: tag.name },
  })

  if (error) {
    logger.error('Failed to add user tag (client helper)', { error, tagKey: tag.key })
    return { error }
  }

  logger.info('User tag added via upstream user-tags endpoint', { tagKey: tag.key })

  /*
   * Cache invalidation limitation:
   * This clears an in-memory Map cache on the single server instance that handles
   * the /api/user-tags/clear request. In serverless or multi-instance deployments,
   * other instances may retain stale cached tags, leading to inconsistent reads.
   *
   * Alternatives for production:
   * 1. Use Next.js cache invalidation: revalidateTag() with unstable_cache()
   *    or revalidatePath() to leverage Next.js's built-in distributed cache
   * 2. Use a shared cache store (e.g., Redis, Vercel KV) for cross-instance consistency
   * 3. Avoid cross-request in-memory caching for user-specific data; rely on
   *    Next.js data cache or fetch-level caching with proper revalidation tags
   *
   * Current approach is sufficient for single-instance dev/preview environments.
   */
  try {
    // call our internal Next.js route which clears the in-memory cache for the current session
    await fetch('/api/user-tags/clear', { method: 'POST', credentials: 'include' })
  } catch (err) {
    // best-effort: if clearing cache fails, continue without blocking
    logger.warn('Failed to call cache-clear endpoint', { error: String(err) })
  }

  return { data }
}

export async function getUserTags(session: CustomSession | null) {
  if (!session?.user) {
    logger.warn('Unauthorized attempt to get user tags (client helper)')
    return { error: 'Unauthorized: Login required' }
  }

  const url = `${APIUrl}/user-tags`
  const { data, error } = await apiRequestWithAuth(session, url, { method: 'GET' })

  if (error) {
    logger.error('Failed to fetch user tags', { error })
    return { error }
  }

  // Expect upstream to return array of { key, name }
  return { data }
}
