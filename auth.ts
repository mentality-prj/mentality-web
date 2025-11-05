import NextAuth, { Account } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

import { ProviderKey } from './constants/providers'
import { Routes } from './constants/routes'
import { extendToken, validateToken } from './helpers/auth'
import { ExtendedSession, ExtendedToken, SessionParams } from './types/auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      authorization: { params: { access_type: 'offline', prompt: 'consent' } },
    }),
    GitHub,
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
          console.error('Error refreshing access_token', error)
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
          // GitHub has no idToken
          session.OAuthToken = token.idToken as string
        }

        await validateToken(session, session.OAuthToken, token.provider as ProviderKey)

        session.provider = token.provider as string
      }

      return session
    },
  },
})
