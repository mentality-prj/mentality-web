import { logger } from '@/lib/logger'
import { CustomSession } from '@/types/auth'

/** Public NestJS endpoints use the same same-origin BFF, never a browser-to-NestJS URL. */
export async function publicApiRequest<T extends object>(path: '/contact', payload: T): Promise<Response> {
  return fetch(`/api/backend${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })
}

export type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: Record<string, unknown> | FormData
  headers?: HeadersInit
}

export type ApiWrapperResult<T> = {
  data?: T
  headers?: Headers
  error?: {
    name: string
    message: string
    status?: number
  }
}

const FORBIDDEN_CALLER_CREDENTIAL_HEADERS = new Set([
  'authorization',
  'proxy-authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'x-dip-admin-api-key',
  'x-qdip-admin-api-key',
])

/**
 * Wrapper for API requests that uses the server session for authorization
 * @param session - User session from useSession()
 * @param url - API endpoint URL
 * @param options - Fetch options (method, body, headers)
 * @returns Promise with data or error
 */
export async function apiRequest<T = unknown>(
  session: CustomSession | null,
  url: string,
  options: ApiRequestOptions = {}
): Promise<ApiWrapperResult<T>> {
  const { method = 'GET', body, headers: customHeaders = {} } = options

  // Check if user is authenticated
  if (!session?.user) {
    logger.warn('API request attempted without authentication', { url, method })
    return {
      error: {
        name: 'Unauthorized',
        message: 'You must be logged in to perform this action',
        status: 401,
      },
    }
  }

  // Check if session is in error state (e.g., expired, refresh token error)
  if (session.error) {
    logger.warn('API request attempted with invalid/expired session', {
      url,
      method,
      error: session.error,
      userId: session.user?.email,
    })
    const errorObj =
      typeof session.error === 'string' ? { message: session.error, error: session.error, status: 401 } : session.error

    return {
      error: {
        name: 'SessionError',
        message: errorObj.message || 'Session is invalid or expired',
        status: errorObj.status || 401,
      },
    }
  }

  // Browser calls are proxied through a same-origin, server-authenticated BFF.
  // SSR and Server Components still call NestJS directly using their server session.
  const isBrowser = typeof window !== 'undefined'
  const token = isBrowser ? undefined : session.OAuthToken
  if (!isBrowser && !token) {
    return {
      error: { name: 'Unauthorized', message: 'Authentication token is missing', status: 401 },
    }
  }

  try {
    // The browser must never attach credentials to an arbitrary external URL.
    // The BFF reads the HttpOnly session and performs authorization server-side.
    const headers = new Headers()
    let requestUrl = url
    if (isBrowser) {
      try {
        const backend = new URL((await import('@/requests/config')).APIUrl)
        const target = new URL(url, backend)
        const basePath = backend.pathname.replace(/\/+$/, '')
        const normalizedPath = target.pathname.replace(/\/{2,}/g, '/')
        if (target.origin !== backend.origin || !normalizedPath.startsWith(`${basePath}/`)) {
          throw new Error('Backend URL is not in the configured API namespace')
        }
        const route = normalizedPath.slice(basePath.length)
        requestUrl = `/api/backend${route}${target.search}`
      } catch {
        return { error: { name: 'InvalidBackendUrl', message: 'Invalid backend API destination' } }
      }
    }
    // A caller cannot supply another bearer, cookie or privileged API key.
    // Headers normalizes names case-insensitively and handles every HeadersInit shape.
    const callerHeaders = new Headers(customHeaders)
    callerHeaders.forEach((value, name) => {
      if (FORBIDDEN_CALLER_CREDENTIAL_HEADERS.has(name.toLowerCase())) {
        logger.warn('Ignoring caller-supplied credential header', { header: name, method })
        return
      }
      headers.set(name, value)
    })
    // Server rendering alone may forward its already-validated session token.
    // Do this after caller headers so user input can never override it.
    if (!isBrowser) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    // Add Content-Type for JSON body
    if (body && !(body instanceof FormData)) {
      headers.set('Content-Type', 'application/json')
    }

    // Browsers authenticate to the same-origin BFF with HttpOnly cookies.
    // Mutating BFF requests require an Origin matching this application's origin.
    // Server-side calls still use the backend-validated bearer token.
    // Never trust client-provided Authorization headers for BFF authority.

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method,
      headers,
      // Authenticated requests contain personal data and must not be cached by
      // Next.js's Data Cache (only the Router Cache is cleared by router.refresh()).
      cache: 'no-store',
    }

    // Add body if present
    if (body) {
      fetchOptions.body = body instanceof FormData ? body : JSON.stringify(body)
    }

    // Make the request
    const response = await fetch(requestUrl, fetchOptions)

    // Handle non-OK responses
    if (!response.ok) {
      let errorData: { message?: string } = {}

      try {
        errorData = await response.json()
      } catch (parseError) {
        logger.warn('Failed to parse error response as JSON', {
          url,
          method,
          status: response.status,
          parseError,
        })
        errorData = { message: response.statusText }
      }

      const error = {
        name: getErrorName(response.status),
        message: errorData.message || `Failed to process request (HTTP ${response.status}: ${response.statusText})`,
        status: response.status,
      }

      logger.error('API request failed', {
        url,
        method,
        status: response.status,
        error: errorData,
        userId: session.user?.email,
      })

      return { error }
    }

    // Parse response data
    let data: T | undefined
    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      data = await response.json()
    }

    logger.info('API request successful', {
      url,
      method,
      status: response.status,
    })

    return { data, headers: response.headers }
  } catch (err) {
    const error = {
      name: 'NetworkError',
      message: err instanceof Error ? err.message : 'Network error occurred',
    }

    logger.error('API request network error', {
      url,
      method,
      error: err,
      userId: session.user?.email,
    })

    return { error }
  }
}

/**
 * Get error name based on HTTP status code
 */
function getErrorName(status: number): string {
  switch (status) {
    case 400:
      return 'BadRequest'
    case 401:
      return 'Unauthorized'
    case 403:
      return 'Forbidden'
    case 404:
      return 'NotFound'
    case 409:
      return 'Conflict'
    case 422:
      return 'ValidationError'
    case 500:
      return 'ServerError'
    case 502:
      return 'BadGateway'
    case 503:
      return 'ServiceUnavailable'
    default:
      return 'Error'
  }
}
