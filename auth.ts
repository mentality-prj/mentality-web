import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
  }
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
      // Якщо токен OAuth успішно отримано, додаємо його до токена сесії
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      // Додаємо токен до сесії, щоб можна було отримати його на фронтенді
      if (typeof token?.accessToken === 'string') {
        session.accessToken = token.accessToken
      }
      return session
    },
  },
})
