import NextAuth, { Account } from 'next-auth'
import Google from 'next-auth/providers/google'

import { ProviderKey } from './constants/providers'
import { Routes } from './constants/routes'
import { extendToken, mapBackendUserToSession, validateToken } from './helpers/auth'
import logger from './lib/logger'
import { ExtendedSession, ExtendedToken, SessionParams, UserAI } from './types/auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      authorization: { params: { access_type: 'offline', prompt: 'consent' } },
    }),
  ],
  pages: {
    signIn: Routes.SIGNIN,
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
    async jwt({ account, token }: { token: ExtendedToken; account?: Account | null }): Promise<ExtendedToken> {
      // If the OAuth token is successfully received, we add it to the session token
      if (account) {
        const customToken = extendToken(account, token)

        // Call backend to create/validate user and get backend user ID
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
            if (backendUserData && typeof backendUserData === 'object' && backendUserData._id) {
              customToken.backendUserId = backendUserData._id
              customToken.backendUserData = backendUserData
            } else {
              logger.error('[AUTH] Received malformed backend user data', {
                hasData: !!backendUserData,
                isObject: typeof backendUserData === 'object',
                hasId: backendUserData?._id,
                provider: account.provider,
              })
              customToken.backendUserError = 'Malformed backend user data'
            }
          } else {
            logger.error('[AUTH] Backend token validation failed', {
              status: response.status,
              statusText: response.statusText,
              provider: account.provider,
            })
            customToken.backendUserError = `Backend validation failed: ${response.status} ${response.statusText}`
          }
        } catch (error) {
          logger.error(
            '[AUTH] Error getting backend user ID',
            error instanceof Error ? error : new Error(String(error))
          )
        }

        return customToken
      } else if (typeof token.expiresAt === 'number' && Date.now() < token.expiresAt * 1000) {
        return token
      } else {
        if (!token.refreshToken) throw new TypeError('Missing refresh_token')

        try {
          const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            body: new URLSearchParams({
              client_id: process.env.AUTH_GOOGLE_ID as string,
              client_secret: process.env.AUTH_GOOGLE_SECRET as string,
              grant_type: 'refresh_token',
              refresh_token: token.refresh_token as string,
            }),
          })
          const tokensOrError = await response.json()

          if (!response.ok) throw tokensOrError

          const newTokens = tokensOrError as {
            access_token: string
            expires_in: number
            refresh_token?: string
          }

          return {
            ...token,
            accessToken: newTokens.access_token,
            expiresAt: Math.floor(Date.now() / 1000 + newTokens.expires_in),
            refreshToken: newTokens.refresh_token ? newTokens.refresh_token : token.refreshToken,
          }
        } catch (error) {
          logger.error(
            '[AUTH] Error refreshing access_token',
            error instanceof Error ? error : new Error(String(error))
          )
          token.error = 'RefreshTokenError'
          return token
        }
      }
    },
    async session({ session, token }: SessionParams): Promise<ExtendedSession> {
      // Add the token to the session so that it can be obtained on the frontend

      if (token) {
        session.OAuthToken = token.accessToken as string
        if (token.idToken) {
          session.OAuthToken = token.idToken as string
        }

        // Use backend user data from JWT token if available
        if (token.backendUserId && token.backendUserData && session.user) {
          const userData = token.backendUserData as UserAI
          mapBackendUserToSession(session, userData)
        } else {
          // Fallback: validate token if backend data not in JWT
          await validateToken(session, session.OAuthToken, token.provider as ProviderKey)
        }

        // If backendUserError is set in the token, surface it to the session
        if (token.backendUserError && typeof token.backendUserError === 'string') {
          session.error = {
            message: 'Backend authentication error',
            error: token.backendUserError,
          }
        }

        session.provider = token.provider as string
      }

      return session
    },
  },
})
