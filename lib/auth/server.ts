import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { AUTH_TOKEN_COOKIE } from '@/lib/auth/constants'
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

const inFlightSessionRequests = new Map<string, Promise<CustomSession | null>>()

async function resolveServerSession(tokenCookie: string): Promise<CustomSession | null> {
  const tokens = parseStoredAuthTokensCookie(tokenCookie)
  if (!tokens?.accessToken) return null

  try {
    const response = await fetch(`${APIUrl}/auth/validate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      cache: 'no-store',
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
  }
}

/**
 * Server-side session helper — provider-agnostic.
 *
 * Reads the auth token cookie and validates with the backend.
 * Use in Server Components and Route Handlers.
 *
 * Note: Token refresh is handled by middleware (which covers all locale routes).
 * If used in API Route Handlers (not covered by middleware matcher), callers
 * should handle the null return by triggering a client-side refresh.
 */
export async function getServerSession(): Promise<CustomSession | null> {
  const cookieStore = cookies()
  const tokenCookie = cookieStore.get(AUTH_TOKEN_COOKIE)?.value

  if (!tokenCookie) return null

  const existingRequest = inFlightSessionRequests.get(tokenCookie)
  if (existingRequest) {
    return existingRequest
  }

  const requestPromise = resolveServerSession(tokenCookie)
  inFlightSessionRequests.set(tokenCookie, requestPromise)

  try {
    return await requestPromise
  } finally {
    if (inFlightSessionRequests.get(tokenCookie) === requestPromise) {
      inFlightSessionRequests.delete(tokenCookie)
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
