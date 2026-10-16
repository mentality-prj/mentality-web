import { apiRequestWithAuth } from '@/helpers/api-request-with-auth'
import { logger } from '@/lib/logger'
import { CustomSession } from '@/types/auth'
import { COMPANY_ROLES } from '@/types/rbac'
import { Roles } from '@/types/security'

type Result<T> = { data?: T; headers?: Headers } | { error: string; status?: number }

export type ApiResponseDecoder<T> = (value: unknown) => { success: true; data: T } | { success: false }

type RequestOptions<T> = {
  method?: string
  body?: Record<string, unknown> | FormData
  /** Optional runtime validation. Legacy callers are unchanged until migrated. */
  decodeResponse?: ApiResponseDecoder<T>
}

/**
 * Perform an authenticated API request and normalize the result to { data } | { error }
 */
export async function performAuthRequest<T = unknown>(
  session: CustomSession | null,
  url: string,
  options?: RequestOptions<T>
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

  if (options?.decodeResponse) {
    try {
      const decoded = options.decodeResponse(data)
      if (!decoded.success) {
        logger.error('Invalid API response contract', { url, method })
        return { error: 'Invalid API response from backend', status: 502 }
      }

      return { data: decoded.data, headers }
    } catch {
      logger.error('API response decoder failed', { url, method })
      return { error: 'Invalid API response from backend', status: 502 }
    }
  }

  // Backward-compatible unvalidated path. Incrementally move callers to
  // decodeResponse rather than asserting a generic type on this raw JSON.
  return { data, headers }
}

/**
 * Convenience helper for actions that require admin role. Returns { error } when unauthorized.
 */
export async function performAdminRequest<T = unknown>(
  session: CustomSession | null,
  url: string,
  options?: RequestOptions<T>
): Promise<Result<T>> {
  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn('Unauthorized admin attempt', { userId: session?.user?.email, role: session?.user?.role, url })
    return { error: 'Unauthorized: Admin role required' }
  }

  return performAuthRequest<T>(session, url, options)
}

/**
 * Company administration is distinct from platform administration.
 * The company and the superuser role must both come from the backend-verified session;
 * callers may not authorize a different tenant by supplying an arbitrary companyId.
 * The NestJS guards still verify every request against live memberships.
 */
export async function performCompanyAdminRequest<T = unknown>(
  session: CustomSession | null,
  companyId: string,
  url: string,
  options?: RequestOptions<T>
): Promise<Result<T>> {
  if (
    !session?.user ||
    session.user.role === Roles.ADMIN ||
    !companyId ||
    session.user.companyId !== companyId ||
    session.user.companyRole !== COMPANY_ROLES.SUPERUSER
  ) {
    logger.warn('Unauthorized company administration attempt', {
      userId: session?.user?.id,
      companyId,
    })
    return { error: 'Unauthorized: company administrator role required' }
  }

  return performAuthRequest<T>(session, url, options)
}
