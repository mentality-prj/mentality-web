import { Account, Session, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'

import { ProviderKey } from '@/constants/providers'

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

export type ExtendedToken = GoogleToken | JWT
export type ExtendedSession = GoogleSession | Session

export interface GoogleToken extends JWT {
  accessToken: string
  refreshToken: string
  expiresIn: number
  idToken: string
  provider: 'google'
  tokenType: 'bearer'
  type: 'oauth'
  backendUserId?: string // Backend user ID from NestJS
  backendUserData?: UserAI // Full backend user data
  backendUserError?: string // Error message if backend validation fails
}

export interface GoogleSession extends Session {
  accessToken: string
  idToken: string
  provider: 'google'
}

export interface JWTParams {
  account: Account | null
  token: JWT
}

export interface CustomUser extends User {
  role?: UserRole
  isAIAuthorized?: boolean
}

export interface SessionError {
  message: string
  error: string
  status?: number
}

export interface CustomSession extends Session {
  user?: CustomUser
  OAuthToken?: string
  provider?: string
  error?: SessionError
}

export interface SessionParams {
  session: CustomSession
  token: ExtendedToken
}
