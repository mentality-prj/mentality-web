const SEGMENT_PATTERN = /^[A-Za-z0-9._~-]+$/

export function getValidatedBackendPath(segments: string[], search: string): string | null {
  if (!Array.isArray(segments) || segments.length === 0 || segments.length > 32) return null
  if (segments.some((segment) => !SEGMENT_PATTERN.test(segment) || segment === '.' || segment === '..')) return null
  // Identity-provider endpoints must never be available through this data proxy.
  if (segments[0] === 'auth') return null
  return `${segments.join('/')}${search}`
}

