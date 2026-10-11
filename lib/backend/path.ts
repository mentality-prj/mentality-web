const SEGMENT_PATTERN = /^[A-Za-z0-9._~-]+$/

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * Only the end-user /auth/me data API is exposed. All IdP/token endpoints
 * remain server-only. Reject encoded segments rather than trusting the router's
 * decoding behavior (which varies between Next.js versions).
 */
export function getValidatedBackendPath(segments: string[], search: string, method: HttpMethod = 'GET'): string | null {
  if (!Array.isArray(segments) || segments.length === 0 || segments.length > 32) return null
  if (segments.some((segment) => !SEGMENT_PATTERN.test(segment) || segment === '.' || segment === '..')) return null

  // Anonymous contact submissions must still use the same NestJS gateway.
  // The NestJS endpoint is public but validates reCAPTCHA server-side.
  if (segments[0].toLowerCase() === 'contact') {
    return segments.length === 1 && segments[0] === 'contact' && method === 'POST' && !search ? 'contact' : null
  }

  const first = segments[0].toLowerCase()
  if (first === 'auth') {
    const me = segments[0] === 'auth' && segments.length === 2 && segments[1] === 'me'
    const preferences =
      segments[0] === 'auth' && segments.length === 3 && segments[1] === 'me' && segments[2] === 'analytics-preferences'
    if (!(me && method === 'GET') && !(preferences && (method === 'GET' || method === 'PATCH'))) {
      return null
    }
  }

  return `${segments.join('/')}${search}`
}
