'use client'
import { useEffect } from 'react'

import { useAuth } from '@/context/AuthProvider'
import { logger } from '@/lib/logger'

export function SessionWrapper({ children }: { children: React.ReactNode }) {
  const { session, logout } = useAuth()

  useEffect(() => {
    if (session?.error) {
      const errorType = typeof session.error === 'string' ? session.error : session.error.error

      const shouldSignOut =
        errorType === 'RefreshTokenError' || errorType === 'BackendConnectionError' || errorType === 'InvalidToken'

      if (shouldSignOut) {
        logger.warn('[SESSION] Critical session error detected, signing out user', { error: session.error })
        logout()
      } else {
        logger.info('[SESSION] Non-critical session error detected', { error: session.error })
      }
    }
  }, [session, logout])

  return <>{children}</>
}
