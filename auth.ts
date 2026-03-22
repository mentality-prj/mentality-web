import NextAuth, { Account } from 'next-auth'
import Google from 'next-auth/providers/google'

import { Routes } from './constants/routes'
import { extendToken, mapBackendUserToSession, refreshAccessToken } from './helpers/auth'
import logger from './lib/logger'
import { CustomSession, ExtendedSession, ExtendedToken, SessionError, SessionParams, UserAI } from './types/auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      authorization: { params: { access_type: 'offline', prompt: 'consent' } },
    }),
  ],
  pages: {
    signIn: Routes.SIGNIN,
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
    async jwt({ account, token }: { token: ExtendedToken; account?: Account | null }): Promise<ExtendedToken> {
      if (account) {
        const customToken = extendToken(account, token)

        // Validate token with backend
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/validate-token`, {
            method: 'POST',
            body: JSON.stringify({
              token: customToken.idToken ?? customToken.accessToken,
              provider: account.provider,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          })

          if (response.ok) {
            const backendUserData = await response.json()
            if (backendUserData && backendUserData._id) {
              customToken.backendUserId = backendUserData._id
              customToken.backendUserData = backendUserData
              return customToken // Return token only after successful validation
            } else {
              logger.error('[AUTH] Malformed backend user data', { backendUserData })
              throw new Error('Malformed backend user data')
            }
          } else {
            logger.error('[AUTH] Backend validation failed', {
              status: response.status,
              statusText: response.statusText,
            })
            throw new Error(`Backend validation failed: ${response.status} ${response.statusText}`)
          }
        } catch (error) {
          logger.error('[AUTH] Backend connection error', {
            error: error instanceof Error ? error.message : String(error),
          })
          return {
            ...customToken,
            error: 'BackendConnectionError',
            accessToken: null,
            refreshToken: null,
          } as ExtendedToken
        }
      }

      // Check if token is still valid
      if (typeof token.expiresAt === 'number' && Date.now() < token.expiresAt * 1000) {
        return token
      }

      // Token has expired, try to refresh it
      logger.info('[AUTH] Token expired, attempting refresh')
      const refreshedToken = await refreshAccessToken(token)

      // If refresh failed, return error
      if (refreshedToken.error) {
        logger.warn('[AUTH] Token refresh failed', { error: refreshedToken.error })
        return refreshedToken
      }

      // Validate refreshed token with backend
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/validate-token`, {
          method: 'POST',
          body: JSON.stringify({
            token: refreshedToken.idToken ?? refreshedToken.accessToken,
            provider: refreshedToken.provider,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })

        if (response.ok) {
          const backendUserData = await response.json()
          if (backendUserData && backendUserData._id) {
            refreshedToken.backendUserId = backendUserData._id
            refreshedToken.backendUserData = backendUserData
            logger.info('[AUTH] Refreshed token validated successfully')
            return refreshedToken
          }
        }

        logger.error('[AUTH] Backend validation failed for refreshed token')
        return {
          ...refreshedToken,
          error: 'BackendConnectionError',
        }
      } catch (error) {
        logger.error('[AUTH] Backend connection error during token refresh', {
          error: error instanceof Error ? error.message : String(error),
        })
        return {
          ...refreshedToken,
          error: 'BackendConnectionError',
        }
      }
    },

    async session({ session, token }: SessionParams): Promise<ExtendedSession> {
      if (token.error) {
        logger.warn('[AUTH] Session creation blocked due to token error', { error: token.error })
        const errorObj: SessionError =
          typeof token.error === 'string'
            ? { error: token.error, message: token.error }
            : ((): SessionError => {
                const e = token.error as Record<string, unknown>
                const err = typeof e.error === 'string' ? e.error : 'UnknownError'
                const msg = typeof e.message === 'string' ? e.message : JSON.stringify(e)
                return { error: err, message: msg }
              })()
        const customSession: CustomSession = {
          ...session,
          error: errorObj,
        }
        return customSession
      }

      if (token.backendUserId && token.backendUserData && session.user) {
        const userData = token.backendUserData as UserAI
        mapBackendUserToSession(session, userData)
      }

      session.provider = token.provider as string

      const authToken = token.idToken ?? token.accessToken
      if (!authToken) {
        logger.error('[AUTH] No idToken or accessToken available in token')
        const customSession: CustomSession = {
          ...session,
          error: { error: 'InvalidToken', message: 'No idToken or accessToken available in token' },
        }
        return customSession
      }
      session.OAuthToken = authToken as string

      return session
    },
  },
})
