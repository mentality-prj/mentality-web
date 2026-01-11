export function extractErrorMessage(error: unknown, fallback?: string): string {
  if (error == null) return fallback ?? 'Unknown error'

  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message

  if (typeof error === 'object') {
    const e = error as Record<string, unknown>
    if (typeof e.message === 'string') return e.message
    if (typeof e.error === 'string') return e.error
    // api-wrapper style: { name, message, status }
    if (typeof e.name === 'string' && typeof e.message === 'string') return e.message
  }

  return fallback ?? String(error)
}

export default extractErrorMessage
