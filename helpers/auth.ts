import { Account } from 'next-auth'
import { JWT } from 'next-auth/jwt'

import { ProviderKey } from '@/constants/providers'
import { logger } from '@/lib/logger'
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
        const errorData = await response.json()

        logger.warn('Token validation failed', { status: response.status, error: errorData })

        switch (response.status) {
          case 401:
            // You are not authorized. Please log in.
            session.error = { message: 'Unauthorized:', error: errorData.message, status: 401 }
            break
          case 500:
            // 'An internal server error occurred. Please try again later.'
            session.error = { message: 'Server Error:', error: errorData.message, status: 500 }
            break
          default:
            // Unknown Error
            session.error = { message: 'Error:', error: errorData.message, status: response.status }
        }
        return null
      }

      const data: UserAI = await response.json()

      // debt: Add user data from Java server to the session
      if (data) {
        session.user.id = data._id
        session.user.name = data.name
        session.user.email = data.email
        session.user.role = data.role
        session.user.isAIAuthorized = true
        return data // Return user data for use in jwt callback
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error : String(error)
      logger.error('Token validation error', error, { provider, session: session.user?.email })
      session.error = { message: 'Token validation error:', error: errorMessage }
    }
  }
  return null
}
