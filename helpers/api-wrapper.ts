import { logger } from '@/lib/logger'
import { CustomSession } from '@/types/auth'

export type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: Record<string, unknown> | FormData
  headers?: HeadersInit
}

type ApiWrapperResult<T> = {
  data?: T
  error?: {
    name: string
    message: string
    status?: number
  }
}

/**
 * Wrapper for API requests that automatically adds user token to headers
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

  // Get OAuth token from session
  const token = session.OAuthToken

  if (!token) {
    logger.warn('API request attempted without OAuth token', { url, method, userId: session.user?.email })
    return {
      error: {
        name: 'Unauthorized',
        message: 'Authentication token is missing',
        status: 401,
      },
    }
  }

  try {
    // Prepare headers
    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    })

    // Merge custom headers
    if (customHeaders) {
      Object.entries(customHeaders).forEach(([key, value]) => {
        if (typeof value === 'string') {
          headers.set(key, value)
        } else {
          logger.warn('Custom header value is not a string and will be ignored', {
            header: key,
            value,
            url,
            method,
          })
        }
      })
    }

    // Add Content-Type for JSON body
    if (body && !(body instanceof FormData)) {
      headers.set('Content-Type', 'application/json')
    }

    // CSRF Protection Note:
    // OAuth Bearer tokens in Authorization headers are NOT vulnerable to CSRF attacks because:
    // 1. Browsers don't automatically include Authorization headers in cross-origin requests
    // 2. Unlike cookies, tokens must be explicitly added by JavaScript
    // 3. The backend validates the OAuth token for each request
    // 4. NextAuth.js session cookies use SameSite=Lax for additional protection
    //
    // Traditional CSRF protection (tokens, double-submit cookies) is designed for
    // cookie-based authentication where browsers automatically send credentials.
    // With Bearer token authentication, CSRF attacks are not possible.
    //
    // XSS Protection Note:
    // Although Bearer token authentication mitigates CSRF, it does NOT protect against XSS attacks.
    // If an attacker can inject JavaScript into your application, they may be able to steal tokens
    // from client-side storage or session and make authenticated requests on behalf of the user.
    // To protect against XSS, always sanitize user input, encode output, and implement a strong
    // Content Security Policy (CSP).

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method,
      headers,
    }

    // Add body if present
    if (body) {
      fetchOptions.body = body instanceof FormData ? body : JSON.stringify(body)
    }

    // Make the request
    const response = await fetch(url, fetchOptions)

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

    return { data }
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
