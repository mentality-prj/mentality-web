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
    if (session?.error?.error === 'RefreshTokenError') {
      logger.warn('[SESSION] Refresh token expired, signing out user')
      signOut({ callbackUrl: `/${locale}/signin`, redirect: true })
    }
  }, [session, locale])

  return <>{children}</>
}
