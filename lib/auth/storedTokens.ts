import type { AuthTokens, UserRole } from '@/types/auth'

export type StoredAuthTokens = Omit<AuthTokens, 'hasRefreshToken'>

function isUserRole(value: unknown): value is UserRole {
  return value === 'admin' || value === 'user'
}

export function normalizeStoredAuthTokens(payload: unknown): StoredAuthTokens | null {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const record = payload as Record<string, unknown>
  const accessToken = typeof record.accessToken === 'string' ? record.accessToken.trim() : ''
  const idToken = typeof record.idToken === 'string' ? record.idToken.trim() : ''
  const expiresAt = typeof record.expiresAt === 'number' ? record.expiresAt : Number.NaN

  if (!accessToken || !idToken || !Number.isFinite(expiresAt)) {
    return null
  }

  const tokens: StoredAuthTokens = {
    accessToken,
    idToken,
    expiresAt: Math.floor(expiresAt),
  }

  if (typeof record.refreshToken === 'string' && record.refreshToken.trim()) {
    tokens.refreshToken = record.refreshToken.trim()
  }

  if (isUserRole(record.userRole)) {
    tokens.userRole = record.userRole
  }

  return tokens
}

export function parseStoredAuthTokensCookie(cookieValue?: string | null): StoredAuthTokens | null {
  if (!cookieValue) {
    return null
  }

  try {
    return normalizeStoredAuthTokens(JSON.parse(cookieValue))
  } catch {
    return null
  }
}
