import 'next-auth'
import 'next-auth/jwt'

import { UserRole } from './auth'
import { CompanyRole } from './rbac'

declare module 'next-auth' {
  interface Session {
    user?: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: UserRole
      isAIAuthorized?: boolean
      companyRole?: CompanyRole
    }
    OAuthToken?: string
    provider?: string
    error?: {
      message: string
      error: string
      status?: number
    }
  }

  interface User {
    role?: UserRole
    isAIAuthorized?: boolean
    companyRole?: CompanyRole
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole
    isAIAuthorized?: boolean
  }
}
