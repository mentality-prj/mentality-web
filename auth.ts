import NextAuth, { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

interface CustomJWT extends JWT {
  accessToken?: string
  expiresIn?: number
  idToken?: string
  provider?: string
  tokenType?: string
  type?: string
}

export interface CustomSession extends Session {
  accessToken?: string
  expiresIn?: number
  idToken?: string
  provider?: string
  tokenType?: string
  type?: string
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, GitHub],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
    async jwt({ token, account }) {
      // If the OAuth token is successfully received, we add it to the session token

      if (account) {
        token.accessToken = account.access_token as string
        token.idToken = account.id_token as string
        token.expiresIn = account.expires_in as number
        token.provider = account.provider as string
        token.tokenType = account.token_type as string
        token.type = account.type as string
      }
      return token as CustomJWT
    },
    async session({ session, token }: { session: CustomSession; token: CustomJWT }) {
      // Add the token to the session so that it can be obtained on the frontend
      const { idToken } = token as CustomJWT
      if (idToken) {
        session.idToken = idToken
      }
      return session as CustomSession
    },
  },
})
