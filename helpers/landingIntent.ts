/**
 * Short-lived, non-sensitive navigation intent for the public B2C landing.
 * The OAuth callback consumes only a strict internal allowlist, never a URL
 * supplied by the browser. No mood, diary text, or identity is stored.
 */
export type LandingIntent = 'mood' | 'diary'

const KEY = 'dzvin:landing-intent:v1'
const MAX_AGE_MS = 10 * 60 * 1000

const destinations: Record<LandingIntent, string> = {
  mood: '/mood-tracker',
  diary: '/diary',
}

export function rememberLandingIntent(intent: LandingIntent): void {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.setItem(KEY, JSON.stringify({ intent, createdAt: Date.now() }))
  } catch {
    // Browsers may disable sessionStorage. Login still works via My Day.
  }
}

export function consumeLandingIntent(): string | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.sessionStorage.getItem(KEY)
    window.sessionStorage.removeItem(KEY)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null

    const record = parsed as { intent?: unknown; createdAt?: unknown }
    if (
      (record.intent !== 'mood' && record.intent !== 'diary') ||
      typeof record.createdAt !== 'number' ||
      !Number.isFinite(record.createdAt) ||
      record.createdAt > Date.now() ||
      Date.now() - record.createdAt > MAX_AGE_MS
    ) {
      return null
    }

    return destinations[record.intent]
  } catch {
    return null
  }
}
