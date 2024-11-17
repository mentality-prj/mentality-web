import NextAuth from 'next-auth'
import { ProviderType } from 'next-auth/providers'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

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
      let userToken = session.accessToken as string
      if (token) {
        if (token.idToken) {
          // GitHub has no idToken
          session.idToken = token.idToken as string
          userToken = token.idToken as string
        }

        validateToken(session, userToken, token.provider as ProviderType)

        session.accessToken = token.accessToken as string
        session.provider = token.provider as string
      }

      return session
    },
  },
})
