'use client'

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

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
  const [retryNotBefore, setRetryNotBefore] = useState(0)
  const sessionGeneration = useRef(0)

  const invalidateSession = useCallback(async () => {
    sessionGeneration.current += 1
    setUser(null)
    setTokens(null)
    setStatus('unauthenticated')
    try {
      await authService.clearTokens()
    } catch (err) {
      logger.warn('[AUTH_PROVIDER] Could not clear expired session', {
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }, [])

  // Always validate the company role after a successful refresh, and do not
  // silently keep a rejected backend session authenticated.
  const refreshAndRevalidate = useCallback(async () => {
    const generation = sessionGeneration.current
    try {
      const refreshed = await authService.refreshTokens()
      if (!refreshed) throw new Error('Token refresh failed')

      const verifiedUser = await authService.getUser()
      if (generation !== sessionGeneration.current) return
      if (!verifiedUser) throw new Error('Verified session no longer exists')

      setTokens(refreshed)
      setUser(verifiedUser)
      setError(null)
      setRetryNotBefore(0)
    } catch (err) {
      if (generation !== sessionGeneration.current) return
      // A temporary IdP failure must not log out a still-valid, independently
      // verified backend session. Back off, then retry before actual expiry.
      const current = await authService.getStoredTokens()
      if (generation !== sessionGeneration.current) return
      const secondsRemaining = current ? current.expiresAt - Math.floor(Date.now() / 1000) : 0
      const verifiedUser = secondsRemaining > 10 ? await authService.getUser() : null
      if (generation !== sessionGeneration.current) return
      if (current && verifiedUser) {
        setTokens(current)
        setUser(verifiedUser)
        setError({ error: 'RefreshRetry', message: 'Session refresh will retry shortly' })
        setRetryNotBefore(Date.now() + 15_000)
        return
      }
      logger.warn('[AUTH_PROVIDER] Session refresh permanently failed', {
        error: err instanceof Error ? err.message : String(err),
      })
      setError({ error: 'RefreshTokenError', message: 'Session revalidation failed' })
      await invalidateSession()
    }
  }, [invalidateSession])

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

        const now = Math.floor(Date.now() / 1000)
        if (storedTokens.expiresAt <= now && !storedTokens.hasRefreshToken) {
          if (!cancelled) await invalidateSession()
          return
        }

        // Initial hydration must also refresh a near-expiry session: otherwise
        // it may be rejected by SSR/BFF before the first scheduled timer.
        let sessionTokens = storedTokens
        if (storedTokens.hasRefreshToken && storedTokens.expiresAt <= now + 60) {
          const refreshed = await authService.refreshTokens()
          if (refreshed) {
            sessionTokens = refreshed
          } else if (storedTokens.expiresAt <= Math.floor(Date.now() / 1000)) {
            if (!cancelled) await invalidateSession()
            return
          } else if (!cancelled) {
            setRetryNotBefore(Date.now() + 15_000)
          }
        }

        const currentUser = await authService.getUser()
        if (!cancelled) {
          if (currentUser) {
            setTokens(sessionTokens)
            setUser(currentUser)
            setStatus('authenticated')
          } else {
            await invalidateSession()
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
  }, [invalidateSession])

  // The single refresh timer is bounded on failures; retrying while still
  // verified is preferable to signing a user out on transient Zitadel errors.
  useEffect(() => {
    if (status !== 'authenticated' || !tokens?.expiresAt) return

    const now = Date.now()
    const expiresAtMs = tokens.expiresAt * 1000
    const refreshAtMs = tokens.hasRefreshToken ? expiresAtMs - 60_000 : expiresAtMs
    const delay = Math.max(0, refreshAtMs - now, retryNotBefore - now)
    const timer = setTimeout(() => {
      if (!tokens.hasRefreshToken) {
        void invalidateSession()
      } else {
        void refreshAndRevalidate()
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [status, tokens?.expiresAt, tokens?.hasRefreshToken, retryNotBefore, refreshAndRevalidate, invalidateSession])

  // Background timers may be throttled for hours. On return, reconcile against
  // the shared HttpOnly cookie before letting an idle tab show stale roles.
  useEffect(() => {
    if (status !== 'authenticated') return
    let cancelled = false

    const reconcile = async () => {
      if (document.visibilityState === 'hidden') return
      const generation = sessionGeneration.current
      const latest = await authService.getStoredTokens()
      if (cancelled || generation !== sessionGeneration.current) return
      if (!latest) {
        await invalidateSession()
        return
      }

      if (latest.expiresAt <= Math.floor(Date.now() / 1000) + 60 && latest.hasRefreshToken) {
        await refreshAndRevalidate()
      } else if (latest.expiresAt > (tokens?.expiresAt ?? 0)) {
        const verifiedUser = await authService.getUser()
        if (cancelled || generation !== sessionGeneration.current) return
        if (!verifiedUser) {
          await invalidateSession()
          return
        }
        setTokens(latest)
        setUser(verifiedUser)
        setError(null)
      } else if (latest.expiresAt <= Math.floor(Date.now() / 1000)) {
        await invalidateSession()
      }
    }

    const onFocus = () => void reconcile()
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      cancelled = true
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [status, tokens?.expiresAt, invalidateSession, refreshAndRevalidate])

  const login = useCallback(async () => {
    await authService.login()
  }, [])

  const logout = useCallback(async () => {
    sessionGeneration.current += 1
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
