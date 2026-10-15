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
  ensureFreshSession: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null)
  const [tokens, setTokens] = useState<BrowserAuthSession | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [error, setError] = useState<SessionError | null>(null)
  const [retryNotBefore, setRetryNotBefore] = useState(0)
  const sessionGeneration = useRef(0)
  const verifiedTokens = useRef<BrowserAuthSession | null>(null)

  useEffect(() => {
    verifiedTokens.current = tokens
  }, [tokens])

  const invalidateSession = useCallback(async (observed: BrowserAuthSession | null) => {
    const generation = ++sessionGeneration.current
    try {
      if (observed) {
        // Keep the Web Lock held through conditional cookie deletion. A failed
        // request must not erase a newer rotation performed by another tab.
        const removed = await authService.clearTokensIfUnchanged(observed)
        if (!removed) {
          // The first revision changed under the lock. Validate it; if it is
          // rejected, conditionally invalidate *that* revision as well.
          // Never send an unconditional DELETE against a newer rotation.
          for (let tries = 0; tries < 3; tries += 1) {
            const latest = await authService.getStoredTokens()
            if (generation !== sessionGeneration.current) return
            if (!latest) break

            let verified: CustomUser | null
            try {
              verified = await authService.getUser()
            } catch {
              // A temporary backend outage does not prove the new cookie is
              // invalid. Keep local state until the next reconciliation.
              if (generation === sessionGeneration.current) {
                setRetryNotBefore(Date.now() + 15_000)
              }
              return
            }
            if (generation !== sessionGeneration.current) return
            if (verified) {
              setTokens(latest)
              setUser(verified)
              setError(null)
              setStatus('authenticated')
              setRetryNotBefore(0)
              return
            }
            if (await authService.clearTokensIfUnchanged(latest)) break
          }
        }
      }
    } catch (err) {
      logger.warn('[AUTH_PROVIDER] Could not clear expired session', {
        error: err instanceof Error ? err.message : String(err),
      })
    }
    if (generation !== sessionGeneration.current) return
    setUser(null)
    setTokens(null)
    setStatus('unauthenticated')
  }, [])

  // Always validate the company role after a successful refresh, and do not
  // silently keep a rejected backend session authenticated.
  const refreshAndRevalidate = useCallback(async () => {
    const generation = sessionGeneration.current
    let observed = verifiedTokens.current
    try {
      observed = (await authService.getStoredTokens()) ?? observed
      if (generation !== sessionGeneration.current) return
      const refreshed = await authService.refreshTokens()
      if (refreshed) observed = refreshed
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
      let current: BrowserAuthSession | null = null
      try {
        current = await authService.getStoredTokens()
      } catch {
        // Network failures must not be mistaken for a missing HttpOnly cookie.
        // Keep already verified, unexpired state until a later reconciliation.
        if (verifiedTokens.current && verifiedTokens.current.expiresAt > Math.floor(Date.now() / 1000)) {
          setRetryNotBefore(Date.now() + 15_000)
          return
        }
      }
      if (generation !== sessionGeneration.current) return
      const secondsRemaining = current ? current.expiresAt - Math.floor(Date.now() / 1000) : 0
      let verifiedUser: CustomUser | null = null
      if (secondsRemaining > 10) {
        try {
          verifiedUser = await authService.getUser()
        } catch {
          if (verifiedTokens.current && verifiedTokens.current.expiresAt > Math.floor(Date.now() / 1000)) {
            setRetryNotBefore(Date.now() + 15_000)
            return
          }
        }
      }
      if (generation !== sessionGeneration.current) return
      if (current && verifiedUser) {
        setTokens(current)
        setUser(verifiedUser)
        // session.error is a hard API-request gate, so transient refresh
        // warnings belong in logs, not in the authenticated session object.
        setError(null)
        logger.warn('[AUTH_PROVIDER] Refresh delayed; verified session still valid')
        setRetryNotBefore(Date.now() + 15_000)
        return
      }
      logger.warn('[AUTH_PROVIDER] Session refresh permanently failed', {
        error: err instanceof Error ? err.message : String(err),
      })
      // Do not emit a hard session.error while the old user is still rendered:
      // SessionWrapper would call unconditional logout ahead of the Web Lock.
      await invalidateSession(observed)
    }
  }, [invalidateSession])

  // Initialize: check for existing tokens on mount
  useEffect(() => {
    let cancelled = false

    async function init() {
      const generation = sessionGeneration.current
      const active = () => !cancelled && generation === sessionGeneration.current
      try {
        const storedTokens = await authService.getStoredTokens()
        if (!storedTokens) {
          if (active()) setStatus('unauthenticated')
          return
        }

        if (!active()) return
        const now = Math.floor(Date.now() / 1000)
        if (storedTokens.expiresAt <= now && !storedTokens.hasRefreshToken) {
          if (active()) await invalidateSession(storedTokens)
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
            if (active()) await invalidateSession(storedTokens)
            return
          } else if (active()) {
            setRetryNotBefore(Date.now() + 15_000)
          }
        }

        const currentUser = await authService.getUser()
        if (active()) {
          if (currentUser) {
            setTokens(sessionTokens)
            setUser(currentUser)
            setStatus('authenticated')
          } else {
            await invalidateSession(sessionTokens)
          }
        }
      } catch (err) {
        logger.error('[AUTH_PROVIDER] Init error', {
          error: err instanceof Error ? err.message : String(err),
        })
        if (active()) {
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
    const delay = Math.max(0, Math.min(Math.max(refreshAtMs, retryNotBefore), expiresAtMs) - now)
    const timer = setTimeout(() => {
      if (!tokens.hasRefreshToken || (Date.now() >= expiresAtMs && Date.now() < retryNotBefore)) {
        void invalidateSession(tokens)
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
      let latest: BrowserAuthSession | null
      try {
        latest = await authService.getStoredTokens()
      } catch {
        // Transient 5xx/network failures are distinct from confirmed 401.
        return
      }
      if (cancelled || generation !== sessionGeneration.current) return
      if (!latest) {
        await invalidateSession(null)
        return
      }

      const now = Math.floor(Date.now() / 1000)
      if (latest.expiresAt <= now) {
        // A token that expired during backoff cannot be treated as verified.
        if (latest.hasRefreshToken && Date.now() >= retryNotBefore) {
          await refreshAndRevalidate()
        } else {
          await invalidateSession(latest)
        }
        return
      }
      if (latest.hasRefreshToken && latest.expiresAt <= now + 60 && Date.now() >= retryNotBefore) {
        await refreshAndRevalidate()
        return
      }

      // Even unchanged expiry metadata must be revalidated: role revocation
      // and account switching do not necessarily alter an expiry timestamp.
      let verifiedUser: CustomUser | null
      try {
        verifiedUser = await authService.getUser()
      } catch {
        return
      }
      if (cancelled || generation !== sessionGeneration.current) return
      if (!verifiedUser) {
        await invalidateSession(latest)
        return
      }
      setTokens(latest)
      setUser(verifiedUser)
      setError(null)
    }

    const onFocus = () => void reconcile()
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      cancelled = true
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [status, tokens?.expiresAt, retryNotBefore, invalidateSession, refreshAndRevalidate])

  // Called by /refresh-session before it returns to a protected route.
  // A stale React status alone is not proof that the HttpOnly cookie is fresh.
  const ensureFreshSession = useCallback(async (): Promise<boolean> => {
    const generation = sessionGeneration.current
    try {
      let latest = await authService.getStoredTokens()
      if (generation !== sessionGeneration.current) return false
      if (!latest) {
        await invalidateSession(null)
        return false
      }

      const now = Math.floor(Date.now() / 1000)
      if (latest.expiresAt <= now + 60 && latest.hasRefreshToken) {
        if (Date.now() < retryNotBefore) return false
        const refreshed = await authService.refreshTokens()
        if (generation !== sessionGeneration.current) return false
        if (!refreshed) {
          if (latest.expiresAt <= Math.floor(Date.now() / 1000)) {
            await invalidateSession(latest)
          } else {
            setRetryNotBefore(Date.now() + 15_000)
          }
          return false
        }
        latest = refreshed
      }

      if (latest.expiresAt <= Math.floor(Date.now() / 1000)) {
        await invalidateSession(latest)
        return false
      }
      const verified = await authService.getUser()
      if (generation !== sessionGeneration.current) return false
      if (!verified) {
        await invalidateSession(latest)
        return false
      }
      setTokens(latest)
      setUser(verified)
      setStatus('authenticated')
      setError(null)
      setRetryNotBefore(0)
      return true
    } catch (err) {
      if (generation !== sessionGeneration.current) return false
      logger.warn('[AUTH_PROVIDER] Session recovery deferred', {
        error: err instanceof Error ? err.message : String(err),
      })
      try {
        const latest = await authService.getStoredTokens()
        if (generation !== sessionGeneration.current) return false
        if (!latest || latest.expiresAt <= Math.floor(Date.now() / 1000)) {
          await invalidateSession(latest)
        } else {
          setRetryNotBefore(Date.now() + 15_000)
        }
      } catch {
        // Preserve shared cookies on temporary metadata network errors.
        setRetryNotBefore(Date.now() + 15_000)
      }
      return false
    }
  }, [invalidateSession, retryNotBefore])

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
      ensureFreshSession,
    }),
    [user, status, error, session, login, logout, getToken, ensureFreshSession]
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
