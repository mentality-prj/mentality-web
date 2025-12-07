import { Account } from 'next-auth'
import { JWT } from 'next-auth/jwt'

import { ProviderKey } from '@/constants/providers'
import logger from '@/lib/logger'
import { APIUrl } from '@/requests/config'
import { CustomSession, ExtendedToken, UserAI } from '@/types/auth'

import { toCamelCase } from './gloabal'

export const extendToken = (account: Account, token: JWT): ExtendedToken => {
  Object.keys(account).forEach((key) => {
    const camelCaseKey = toCamelCase(key)
    token[`${camelCaseKey}`] = account[`${key}`]
  })

  return token
}

/**
 * Refreshes an expired Google OAuth access token using the refresh token
 * @param token - The current JWT token with refresh token
 * @returns Updated token with new access token and expiration
 */
export async function refreshAccessToken(token: ExtendedToken): Promise<ExtendedToken> {
  try {
    if (!token.refreshToken) {
      throw new Error('No refresh token available')
    }

    logger.info('[AUTH] Attempting to refresh access token')

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.AUTH_GOOGLE_ID!,
        client_secret: process.env.AUTH_GOOGLE_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken as string,
      }),
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      logger.error('[AUTH] Failed to refresh access token', {
        status: response.status,
        error: refreshedTokens,
      })
      throw new Error('Failed to refresh access token')
    }

    logger.info('[AUTH] Access token refreshed successfully')

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      idToken: refreshedTokens.id_token ?? token.idToken,
      expiresAt: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Use new refresh token if provided
    }
  } catch (error) {
    logger.error('[AUTH] Error refreshing access token', { error })
    return {
      ...token,
      error: 'RefreshTokenError',
    }
  }
}

/**
 * Maps backend user data to session.user object
 * Prevents code duplication between jwt and session callbacks
 */
export const mapBackendUserToSession = (session: CustomSession, userData: UserAI): void => {
  if (session.user) {
    session.user.id = userData._id
    session.user.name = userData.name
    session.user.email = userData.email
    session.user.role = userData.role
    session.user.isAIAuthorized = true
  }
}

export async function validateToken(
  session: CustomSession,
  OAuthToken: string,
  provider: ProviderKey
): Promise<UserAI | null> {
  if (session.user) {
    try {
      // Request to AI backend for token validation
      const response = await fetch(`${APIUrl}/auth/validate-token`, {
        method: 'POST',
        body: JSON.stringify({ token: OAuthToken, provider: provider }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        try {
          const errorData = await response.json()

          switch (response.status) {
            case 401:
              // You are not authorized. Please log in.
              session.error = { message: 'Unauthorized', error: errorData.message, status: 401 }
              break
            case 500:
              // 'An internal server error occurred. Please try again later.'
              session.error = { message: 'Server Error', error: errorData.message, status: 500 }
              break
            default:
              // Unknown Error
              session.error = { message: 'Error', error: errorData.message, status: response.status }
          }
        } catch {
          // If JSON parsing fails, use status text
          session.error = {
            message: 'Backend error',
            error: response.statusText || 'Unknown error',
            status: response.status,
          }
        }
        return null
      }

      const data: UserAI = await response.json()

      if (data) {
        mapBackendUserToSession(session, data)
        return data // Return user data for use in jwt callback
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      session.error = { message: 'Token validation error', error: errorMessage }
    }
  }
  return null
}
