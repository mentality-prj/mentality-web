import { cookies } from 'next/headers'

import { AUTH_TOKEN_COOKIE } from '@/lib/auth/constants'
import { logger } from '@/lib/logger'
import { APIUrl } from '@/requests/config'
import { AuthTokens, CustomSession, CustomUser, UserAI } from '@/types/auth'

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

  let tokens: AuthTokens
  try {
    tokens = JSON.parse(tokenCookie) as AuthTokens
  } catch {
    return null
  }

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
    return null
  }
}
