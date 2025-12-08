'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

import { logger } from '@/lib/logger'

export function SessionWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()

  // Extract locale from pathname (e.g., /en/signin -> en)
  const locale = pathname?.split('/')[1] || 'en'

  useEffect(() => {
    if (session?.error) {
      const errorType = typeof session.error === 'string' ? session.error : session.error.error

      // Only sign out for specific critical errors
      const shouldSignOut =
        errorType === 'RefreshTokenError' || errorType === 'BackendConnectionError' || errorType === 'InvalidToken'

      if (shouldSignOut) {
        logger.warn('[SESSION] Critical session error detected, signing out user', { error: session.error })
        signOut({ callbackUrl: `/${locale}/signin`, redirect: true })
      } else {
        logger.info('[SESSION] Non-critical session error detected', { error: session.error })
      }
    }
  }, [session, locale])

  return <>{children}</>
}
