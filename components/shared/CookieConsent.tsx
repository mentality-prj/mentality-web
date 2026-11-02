'use client'
import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { logger } from '@/lib/logger'
import { Button } from '@/ui/button'

const COOKIE_NAME = 'cookie_consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const t = useTranslations('components.CookieConsent')

  useEffect(() => {
    try {
      const match = document.cookie.match('(^|;)\\s*' + COOKIE_NAME + '\\s*=\\s*([^;]+)')
      const cookieVal = match ? decodeURIComponent(match[2]) : null
      if (!cookieVal) setVisible(true)
    } catch (e) {
      logger.error('CookieConsent: failed to read cookie', e as Error)
      setVisible(false)
    }
  }, [])

  function accept() {
    try {
      // set cookie for one year
      const maxAge = 60 * 60 * 24 * 365 // seconds
      const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : ''
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent('1')}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
      // fallback to localStorage for older browsers
      try {
        localStorage.setItem(COOKIE_NAME, '1')
      } catch (e) {
        logger.error('CookieConsent: localStorage fallback failed', e as Error)
      }
    } catch (e) {
      logger.error('CookieConsent: failed to set cookie', e as Error)
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label={t('title')}
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-[#e4def3] bg-white/95 p-4 shadow-[0_18px_48px_-18px_rgba(48,42,79,0.35)] backdrop-blur-md md:inset-x-6 md:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <div className="min-w-0">
          <p className="sr-only">{t('title')}</p>
          <p className="text-xs leading-5 text-textcolor-secondary sm:text-sm">
            {t('short')}{' '}
            <Link href={Routes.COOKIES} className="font-medium text-primary underline underline-offset-2">
              {t('policy')}
            </Link>
          </p>
          <details className="mt-1 text-xs text-textcolor-secondary sm:text-sm">
            <summary className="inline-flex min-h-8 cursor-pointer items-center font-medium text-textcolor-primary">
              {t('details')}
            </summary>
            <ul className="mt-1 space-y-1">
              {(['analytics', 'authentication', 'preferences'] as const).map((kind) => (
                <li key={kind}>
                  <strong>{t(`cookies.${kind}.name`)}:</strong> {t(`cookies.${kind}.description`)}
                </li>
              ))}
            </ul>
          </details>
        </div>
        <Button onClick={accept} className="w-full shrink-0 sm:w-auto">
          {t('accept')}
        </Button>
      </div>
    </div>
  )
}
