'use client'
import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

import { logger } from '@/lib/logger'

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
    <div className="fixed inset-x-0 bottom-0 z-50 w-full border p-4 shadow-lg backdrop-blur-sm md:p-6">
      <div className="container-max-width mx-auto flex justify-center">
        <div className="flex flex-col gap-xs md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-lg font-semibold">{t('title')}</h3>
            <p className="mt-1 text-sm" style={{ color: 'hsl(var(--text-secondary))' }}>
              {t('description')}
            </p>
            <ul className="mt-2 space-y-1 text-sm" style={{ color: 'hsl(var(--text-secondary))' }}>
              <li className="flex gap-xs">
                <strong className="min-w-[8rem]">{t('cookies.analytics.name')}:</strong>
                <span className="flex-1">{t('cookies.analytics.description')}</span>
              </li>
              <li className="flex gap-xs">
                <strong className="min-w-[8rem]">{t('cookies.authentication.name')}:</strong>
                <span className="flex-1">{t('cookies.authentication.description')}</span>
              </li>
              <li className="flex gap-xs">
                <strong className="min-w-[8rem]">{t('cookies.preferences.name')}:</strong>
                <span className="flex-1">{t('cookies.preferences.description')}</span>
              </li>
            </ul>
          </div>

          <div className="flex-shrink-0 self-end md:self-center">
            <button
              onClick={accept}
              className="inline-flex items-center rounded-full px-4 py-2 shadow-sm"
              style={{
                backgroundColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
              }}
            >
              {t('accept')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
