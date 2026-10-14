import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { AUTH_TOKEN_COOKIE } from '@/lib/auth/constants'
import { ACTIVE_COMPANY_COOKIE, isValidCompanyId } from '@/lib/auth/companyContext'
import { parseStoredAuthTokensCookie, type StoredAuthTokens } from '@/lib/auth/storedTokens'
import { logger } from '@/lib/logger'
import { APIUrl } from '@/requests/config'
import { CustomSession, CustomUser, UserAI } from '@/types/auth'

export type AuthenticatedSession = CustomSession & {
  user: NonNullable<CustomSession['user']>
}

type JwtClaims = Record<string, unknown>

function getStringClaim(claims: JwtClaims | null, keys: string[]): string | null {
  if (!claims) {
    return null
  }

  for (const key of keys) {
    const value = claims[key as string]
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  return null
}

function decodeBase64Url(value: string): string | null {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')

  try {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(padded, 'base64').toString('utf8')
    }

    if (typeof atob === 'function') {
      const binary = atob(padded)
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
      return new TextDecoder().decode(bytes)
    }
  } catch {
    return null
  }

  return null
}

function decodeJwtClaims(token: string): JwtClaims | null {
  const [, payload] = token.split('.')
  if (!payload) {
    return null
  }

  const decodedPayload = decodeBase64Url(payload)
  if (!decodedPayload) {
    return null
  }

  try {
    const parsed = JSON.parse(decodedPayload)
    return parsed && typeof parsed === 'object' ? (parsed as JwtClaims) : null
  } catch {
    return null
  }
}

function buildFallbackSession(tokens: StoredAuthTokens): CustomSession | null {
  // Never derive a session from unverified JWT claims unless explicitly opted in.
  // Gating only on NODE_ENV would allow this path in staging/preview environments
  // that run non-production builds with real user traffic.
  // Require an explicit opt-in flag so it cannot be enabled accidentally.
  if (process.env.NODE_ENV === 'production' || process.env.ALLOW_UNVERIFIED_JWT_SESSION_FALLBACK !== 'true') {
    return null
  }

  if (tokens.expiresAt * 1000 < Date.now()) {
    return null
  }
  const idClaims = decodeJwtClaims(tokens.idToken)
  const accessClaims = decodeJwtClaims(tokens.accessToken)

  const id = getStringClaim(idClaims, ['sub']) ?? getStringClaim(accessClaims, ['sub'])
  if (!id) {
    return null
  }

  const email = getStringClaim(idClaims, ['email']) ?? getStringClaim(accessClaims, ['email']) ?? ''
  const image = getStringClaim(idClaims, ['picture', 'avatarUrl']) ?? getStringClaim(accessClaims, ['picture'])
  const name =
    (getStringClaim(idClaims, ['name', 'preferred_username']) ??
      getStringClaim(accessClaims, ['name', 'preferred_username']) ??
      email) ||
    'Authenticated user'

  const user: CustomUser = {
    id,
    name,
    email,
    ...(image ? { image } : {}),
  }

  return {
    user,
    OAuthToken: tokens.accessToken,
  }
}

// Module-level Map deduplicates concurrent in-flight calls to /auth/validate-token.
// React.cache() would be the idiomatic solution for per-render memoization, but
// A cross-request in-flight cache is used here; cache scope is keyed by request identifiers.
// This Map handles the overlapping-requests case; the Map entry is cleared once
// the promise settles to avoid stale memory.
const inFlightSessionRequests = new Map<string, Promise<CustomSession | null>>()
const requestScopedInFlightSessionRequests = new Map<string, Promise<CustomSession | null>>()
const requestScopedResolvedSessions = new Map<
  string,
  {
    session: CustomSession | null
    expiresAt: number
  }
>()
const REQUEST_SCOPED_CACHE_TTL_MS = 30_000
const REQUEST_SCOPED_CACHE_MAX_ENTRIES = 256

function buildRequestScopedCacheKey(requestId: string, accessToken: string, companyId: string | null): string {
  return `${requestId}:${accessToken}:${companyId ?? ''}`
}

function cleanupRequestScopedResolvedSessions(now: number): void {
  for (const [key, entry] of requestScopedResolvedSessions.entries()) {
    if (entry.expiresAt <= now) {
      requestScopedResolvedSessions.delete(key)
    }
  }

  while (requestScopedResolvedSessions.size > REQUEST_SCOPED_CACHE_MAX_ENTRIES) {
    const firstKey = requestScopedResolvedSessions.keys().next().value as string | undefined
    if (!firstKey) {
      break
    }

    requestScopedResolvedSessions.delete(firstKey)
  }
}

async function resolveServerSession(tokenCookie: string, selectedCompanyId: string | null): Promise<CustomSession | null> {
  const tokens = parseStoredAuthTokensCookie(tokenCookie)
  if (!tokens?.accessToken) return null

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5_000)
  try {
    const response = await fetch(`${APIUrl}/auth/validate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokens.accessToken}`,
        ...(selectedCompanyId ? { 'x-company-id': selectedCompanyId } : {}),
      },
      cache: 'no-store',
      signal: controller.signal,
    })

    if (!response.ok) {
      logger.warn('[SERVER_SESSION] Backend validation failed', { status: response.status })
      return null
    }

    const backendUser: UserAI = await response.json()
    if (!backendUser?._id) return null

    const user: CustomUser = {
      id: backendUser._id,
      name: backendUser.name,
      email: backendUser.email,
      image: backendUser.avatarUrl,
      role: backendUser.role,
      companyId: backendUser.companyId,
      companyRole: backendUser.companyRole,
      isAIAuthorized: true,
    }

    return {
      user,
      OAuthToken: tokens.accessToken,
    }
  } catch (error) {
    logger.error('[SERVER_SESSION] Error fetching session', {
      error: error instanceof Error ? error.message : String(error),
    })

    const fallbackSession = buildFallbackSession(tokens)
    if (fallbackSession) {
      logger.warn('[SERVER_SESSION] Falling back to token-derived session')
      return fallbackSession
    }

    return null
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Server-side session helper — provider-agnostic.
 *
 * Reads the auth token cookie and validates with the backend.
 * Use in Server Components and Route Handlers.
 */
export async function getServerSession(): Promise<CustomSession | null> {
  const cookieStore = await cookies()
  const headerStore = await headers()
  const tokenCookie = cookieStore.get(AUTH_TOKEN_COOKIE)?.value
  const requestedCompanyId = cookieStore.get(ACTIVE_COMPANY_COOKIE)?.value
  const selectedCompanyId = isValidCompanyId(requestedCompanyId) ? requestedCompanyId : null

  if (!tokenCookie) return null

  const tokens = parseStoredAuthTokensCookie(tokenCookie)
  if (!tokens?.accessToken) return null

  const requestId = headerStore.get('x-request-id')
  if (requestId) {
    const requestScopedCacheKey = buildRequestScopedCacheKey(requestId, tokens.accessToken, selectedCompanyId)
    const now = Date.now()
    cleanupRequestScopedResolvedSessions(now)

    const cachedSessionEntry = requestScopedResolvedSessions.get(requestScopedCacheKey)
    if (cachedSessionEntry && cachedSessionEntry.expiresAt > now) {
      return cachedSessionEntry.session
    }

    const existingRequestScopedInFlight = requestScopedInFlightSessionRequests.get(requestScopedCacheKey)
    if (existingRequestScopedInFlight) {
      return existingRequestScopedInFlight
    }

    const requestScopedPromise = resolveServerSession(tokenCookie, selectedCompanyId)
    requestScopedInFlightSessionRequests.set(requestScopedCacheKey, requestScopedPromise)

    try {
      const session = await requestScopedPromise
      requestScopedResolvedSessions.set(requestScopedCacheKey, {
        session,
        expiresAt: Date.now() + REQUEST_SCOPED_CACHE_TTL_MS,
      })
      cleanupRequestScopedResolvedSessions(Date.now())
      return session
    } finally {
      if (requestScopedInFlightSessionRequests.get(requestScopedCacheKey) === requestScopedPromise) {
        requestScopedInFlightSessionRequests.delete(requestScopedCacheKey)
      }
    }
  }
  const dedupeKey = `${tokens.accessToken}:${selectedCompanyId ?? ''}`

  const existingRequest = inFlightSessionRequests.get(dedupeKey)
  if (existingRequest) {
    return existingRequest
  }

  const requestPromise = resolveServerSession(tokenCookie, selectedCompanyId)
  inFlightSessionRequests.set(dedupeKey, requestPromise)

  try {
    return await requestPromise
  } finally {
    if (inFlightSessionRequests.get(dedupeKey) === requestPromise) {
      inFlightSessionRequests.delete(dedupeKey)
    }
  }
}

export async function requireServerSession(redirectTo: string): Promise<AuthenticatedSession> {
  const session = await getServerSession()

  if (!session?.user) {
    redirect(redirectTo)
  }

  return session as AuthenticatedSession
}
