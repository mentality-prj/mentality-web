import { CompanyRole } from '@/types/rbac'

export type UserRole = 'admin' | 'user'

export type UserAI = {
  _id: string
  email: string
  name: string
  avatarUrl: string
  role: UserRole
  zitadelSub?: string
  createdAt: Date
}

export interface SessionError {
  message: string
  error: string
  status?: number
}

export interface CustomUser {
  id: string
  name: string
  email: string
  image?: string
  role?: UserRole
  companyId?: string
  companyRole?: CompanyRole
  isAIAuthorized?: boolean
}

export interface CustomSession {
  user?: CustomUser
  OAuthToken?: string
  provider?: string
  error?: SessionError
  expires?: string
}

export interface AuthTokens {
  accessToken: string
  idToken: string
  refreshToken?: string
  expiresAt: number
  userRole?: UserRole
  /** Returned by GET /api/auth/token — refresh token is kept server-side only */
  hasRefreshToken?: boolean
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface AuthState {
  user: CustomUser | null
  tokens: AuthTokens | null
  status: AuthStatus
  error: SessionError | null
}
