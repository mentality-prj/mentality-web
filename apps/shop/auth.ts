import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

import { ProviderKey } from './constants/providers'
import { Routes } from './constants/routes'
import { extendToken, validateToken } from './helpers/auth'
import { ExtendedSession, ExtendedToken, JWTParams, SessionParams } from './types/auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, GitHub],
  pages: {
    signIn: Routes.SIGNIN,
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
    async jwt({ account, token }: JWTParams): Promise<ExtendedToken> {
      // If the OAuth token is successfully received, we add it to the session token
      if (account) {
        const customToken = extendToken(account, token)
        return customToken
      }

      return token
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
