import { Account, Session, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'

import { ProviderKey } from '@/constants/providers'

export type ExtendedToken = GoogleToken | GitHubToken | JWT
export type ExtendedSession = GoogleSession | GitHubSession | Session

export interface GoogleToken extends JWT {
  accessToken: string
  expiresIn: number
  idToken: string
  provider: 'google'
  tokenType: 'bearer'
  type: 'oauth'
}

export interface GitHubToken extends JWT {
  accessToken: string
  tokenType: 'bearer'
  scope: string
  provider: 'github'
  type: 'oauth'
  providerAccountId: string
}

export interface GoogleSession extends Session {
  accessToken: string
  idToken: string
  provider: 'google'
}

export interface GitHubSession extends Session {
  accessToken: string
  provider: 'github'
}

export interface JWTParams {
  account: Account | null
  token: JWT
}

export interface CustomUser extends User {
  role?: UserRole
  isAIAuthorized?: boolean
}
export interface CustomSession extends Session {
  user?: CustomUser
  OAuthToken?: string
  provider?: string
  error?: { message: string; error: unknown } // debt: add type to error
}

export interface SessionParams {
  session: CustomSession
  token: ExtendedToken
}

export type UserRole = 'admin' | 'user'

export type UserAI = {
  _id: string
  email: string
  name: string
  avatarUrl: string
  role: UserRole
  providers: {
    type: ProviderKey
    id: string
    _id: string
  }[]
  createdAt: Date
}
