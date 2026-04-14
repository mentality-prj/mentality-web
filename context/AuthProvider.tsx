'use client'

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { authService } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { AuthStatus, AuthTokens, CustomSession, CustomUser, SessionError } from '@/types/auth'

interface AuthContextValue {
  user: CustomUser | null
  status: AuthStatus
  error: SessionError | null
  session: CustomSession | null
  login: () => Promise<void>
  logout: () => Promise<void>
  getToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null)
  const [tokens, setTokens] = useState<AuthTokens | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [error, setError] = useState<SessionError | null>(null)

  // Initialize: check for existing tokens on mount
  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const storedTokens = await authService.getStoredTokens()
        if (!storedTokens) {
          if (!cancelled) setStatus('unauthenticated')
          return
        }

        // Check if expired
        if (storedTokens.expiresAt < Math.floor(Date.now() / 1000)) {
          const refreshed = await authService.refreshTokens()
          if (!refreshed) {
            await authService.clearTokens()
            if (!cancelled) setStatus('unauthenticated')
            return
          }
          if (!cancelled) setTokens(refreshed)
        } else {
          if (!cancelled) setTokens(storedTokens)
        }

        const currentUser = await authService.getUser()
        if (!cancelled) {
          if (currentUser) {
            setUser(currentUser)
            setStatus('authenticated')
          } else {
            await authService.clearTokens()
            setStatus('unauthenticated')
          }
        }
      } catch (err) {
        logger.error('[AUTH_PROVIDER] Init error', {
          error: err instanceof Error ? err.message : String(err),
        })
        if (!cancelled) {
          setError({ error: 'InitError', message: 'Failed to initialize auth' })
          setStatus('unauthenticated')
        }
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [])

  // Silent refresh: refresh token before it expires
  useEffect(() => {
    if (!tokens?.expiresAt || !tokens?.refreshToken) return

    const expiresInMs = (tokens.expiresAt - Math.floor(Date.now() / 1000) - 60) * 1000
    if (expiresInMs <= 0) return

    const timer = setTimeout(async () => {
      const refreshed = await authService.refreshTokens()
      if (refreshed) {
        setTokens(refreshed)
      } else {
        setError({ error: 'RefreshTokenError', message: 'Token refresh failed' })
        await authService.clearTokens()
        setTokens(null)
        setUser(null)
        setStatus('unauthenticated')
      }
    }, expiresInMs)

    return () => clearTimeout(timer)
  }, [tokens?.expiresAt, tokens?.refreshToken])

  const login = useCallback(async () => {
    await authService.login()
  }, [])

  const logout = useCallback(async () => {
    setUser(null)
    setTokens(null)
    setStatus('unauthenticated')
    await authService.logout()
  }, [])

  const getToken = useCallback(async () => {
    return authService.getToken()
  }, [])

  const session = useMemo<CustomSession | null>(() => {
    if (!user) return null
    return {
      user,
      OAuthToken: tokens?.accessToken,
      provider: authService.name,
      error: error ?? undefined,
    }
  }, [user, tokens?.accessToken, error])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      error,
      session,
      login,
      logout,
      getToken,
    }),
    [user, status, error, session, login, logout, getToken]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to access auth state and actions.
 * Drop-in replacement for `useSession()` from next-auth/react.
 *
 * Migration guide:
 *   const { data: session, status } = useSession()
 *   →
 *   const { session, status } = useAuth()
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within <AuthProvider>')
  }
  return context
}
