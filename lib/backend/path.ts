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

  // Operator-only lead management is never public. This BFF allows only
  // exact, finite URLs; NestJS separately requires verified operator identity.
  if (segments[0] === 'contact' && segments[1] === 'internal') {
    if (segments[2] !== 'leads') return null
    const objectId = /^[a-fA-F0-9]{24}$/
    if (segments.length === 3 && method === 'GET') {
      const query = new URLSearchParams(search)
      const allowed = new Set(['category', 'stage', 'limit', 'due'])
      const category = query.get('category')
      if (!['business', 'research'].includes(category || '')) return null
      if ([...query.keys()].some((key) => !allowed.has(key) || query.getAll(key).length !== 1)) return null
      const stage = query.get('stage')
      if (stage && !['inquiry', 'qualified', 'demo', 'pilot', 'decision', 'won', 'lost', 'closed'].includes(stage))
        return null
      const due = query.get('due')
      if (due !== null && due !== 'true') return null
      const limit = query.get('limit')
      if (limit && (!/^[1-9][0-9]?$/.test(limit) || Number(limit) > 50)) return null
      return `contact/internal/leads${search}`
    }
    if (search || !objectId.test(segments[3] || '')) return null
    if (segments.length === 4 && method === 'GET') return segments.join('/')
    if (segments.length === 5 && ['stage', 'follow-up'].includes(segments[4]) && method === 'PATCH')
      return segments.join('/')
    if (segments.length === 6 && segments[4] === 'follow-up' && segments[5] === 'complete' && method === 'PATCH')
      return segments.join('/')
    return null
  }

  // Anonymous contact submissions must still use the same NestJS gateway.
  // The NestJS endpoint is public but validates reCAPTCHA server-side.
  if (segments[0].toLowerCase() === 'contact') {
    if (method !== 'POST' || search || segments[0] !== 'contact') return null
    if (segments.length === 1) return 'contact'
    return segments.length === 2 && ['business', 'research'].includes(segments[1]) ? `contact/${segments[1]}` : null
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
