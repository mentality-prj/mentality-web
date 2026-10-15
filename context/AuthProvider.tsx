'use client'

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { authService } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { AuthStatus, BrowserAuthSession, CustomSession, CustomUser, SessionError } from '@/types/auth'

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
  const [tokens, setTokens] = useState<BrowserAuthSession | null>(null)
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

  // Refresh before expiry, then revalidate the user against the backend.
  // Refreshing token metadata alone leaves revoked company roles in the browser.
  useEffect(() => {
    if (status !== 'authenticated' || !tokens?.expiresAt || !tokens?.hasRefreshToken) return

    let cancelled = false
    // Near-expiry tokens must refresh immediately, not stop scheduling altogether.
    const expiresInMs = Math.max(0, (tokens.expiresAt - Math.floor(Date.now() / 1000) - 60) * 1000)

    const timer = setTimeout(async () => {
      try {
        const refreshed = await authService.refreshTokens()
        if (cancelled) return
        if (!refreshed) throw new Error('Token refresh failed')

        // Fetch from the server's verified session, never infer roles from JWTs.
        const verifiedUser = await authService.getUser()
        if (cancelled) return
        if (!verifiedUser) throw new Error('Verified session no longer exists')

        setUser(verifiedUser)
        setTokens(refreshed)
        setError(null)
      } catch (err) {
        if (cancelled) return
        logger.warn('[AUTH_PROVIDER] Refresh or role revalidation failed', {
          error: err instanceof Error ? err.message : String(err),
        })
        setError({ error: 'RefreshTokenError', message: 'Session revalidation failed' })
        setUser(null)
        setTokens(null)
        setStatus('unauthenticated')
        try {
          await authService.clearTokens()
        } catch (clearError) {
          logger.error('[AUTH_PROVIDER] Failed to clear invalid session', {
            error: clearError instanceof Error ? clearError.message : String(clearError),
          })
        }
      }
    }, expiresInMs)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [status, tokens?.expiresAt, tokens?.hasRefreshToken])

  const login = useCallback(async () => {
    await authService.login()
  }, [])

  const logout = useCallback(async () => {
    setUser(null)
    setTokens(null)
    setError(null)
    setStatus('unauthenticated')
    await authService.logout()
  }, [])

  const getToken = useCallback(async () => {
    // Legacy API retained for existing hook consumers, but JWTs stay server-side.
    return null
  }, [])

  const session = useMemo<CustomSession | null>(() => {
    if (!user) return null
    return {
      user,
      provider: authService.name,
      error: error ?? undefined,
    }
  }, [user, error])

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
