import { apiRequestWithAuth } from '@/helpers/api-request-with-auth'
import { logger } from '@/lib/logger'
import { CustomSession } from '@/types/auth'
import { Roles } from '@/types/security'

type Result<T> = { data?: T; headers?: Headers } | { error: string; status?: number }

/**
 * Perform an authenticated API request and normalize the result to { data } | { error }
 */
export async function performAuthRequest<T = unknown>(
  session: CustomSession | null,
  url: string,
  options?: { method?: string; body?: Record<string, unknown> | FormData }
): Promise<Result<T>> {
  // apiRequestWithAuth expects ApiRequestOptions with method keys in uppercase
  const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const
  type HttpMethod = (typeof allowedMethods)[number]

  const method: HttpMethod | undefined = options?.method
    ? allowedMethods.includes(options.method.toUpperCase() as HttpMethod)
      ? (options.method.toUpperCase() as HttpMethod)
      : undefined
    : 'GET'

  const { data, error, headers } = await apiRequestWithAuth<T>(
    session,
    url,
    {
      method,
      body: options?.body,
    },
    { autoSignOutOn401: false }
  )

  if (error) {
    logger.error('API request failed', { url, method, error })
    let message: string
    if (typeof error === 'object' && error !== null && 'message' in error) {
      const errObj = error as { message?: unknown; status?: number }
      message = typeof errObj.message === 'string' ? errObj.message : String(errObj.message ?? String(error))
      return { error: message, status: errObj.status }
    } else {
      message = String(error)
    }
    return { error: message }
  }

  return { data: data as T, headers }
}

/**
 * Convenience helper for actions that require admin role. Returns { error } when unauthorized.
 */
export async function performAdminRequest<T = unknown>(
  session: CustomSession | null,
  url: string,
  options?: { method?: string; body?: Record<string, unknown> | FormData }
): Promise<Result<T>> {
  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn('Unauthorized admin attempt', { userId: session?.user?.email, role: session?.user?.role, url })
    return { error: 'Unauthorized: Admin role required' }
  }

  return performAuthRequest<T>(session, url, options)
}
