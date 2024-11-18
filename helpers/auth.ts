import { Account } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { ProviderType } from 'next-auth/providers'

import { CustomSession, ExtendedToken, UserAI } from '@/types/auth'

import { toCamelCase } from './gloabal'

const APIUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3200/api'

export const extendToken = (account: Account, token: JWT): ExtendedToken => {
  Object.keys(account).forEach((key) => {
    const camelCaseKey = toCamelCase(key)
    token[camelCaseKey] = account[key]
  })

  return token
}

export async function validateToken(session: CustomSession, userToken: string, provider: ProviderType) {
  if (session.user) {
    try {
      // Request to AI backend for token validation
      const response = await fetch(`${APIUrl}/auth/validate-token`, {
        method: 'POST',
        body: JSON.stringify({ token: userToken, provider: provider }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      const data: UserAI = await response.json()

      // debt: Add user data from Java server to the session
      session.user.name = data.name
      session.user.email = data.email
      session.user.role = data.role
      session.user.isAIAuthorized = true
    } catch (error) {
      console.error('Server token validation error:', error)
      session.error = { message: 'Server token validation error:', error }
    }
  }
}
