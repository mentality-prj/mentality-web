'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { authService } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { SupportedLanguage, supportedLanguages } from '@/types/languages'
import { Button } from '@/ui/button'

const LOCALE_COOKIE = 'NEXT_LOCALE'
const DEFAULT_LOCALE: SupportedLanguage = 'uk'

function getPreferredLocale(): SupportedLanguage {
  // 1. Check saved cookie
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE}=([^;]*)`))
  const cookieLocale = match?.[1]
  if (cookieLocale && supportedLanguages.includes(cookieLocale as SupportedLanguage)) {
    return cookieLocale as SupportedLanguage
  }

  // 2. Check browser language
  const browserLang = navigator.language?.split('-')[0]
  if (browserLang && supportedLanguages.includes(browserLang as SupportedLanguage)) {
    return browserLang as SupportedLanguage
  }

  // 3. Fallback
  return DEFAULT_LOCALE
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
          <p className="mt-4 text-textcolor-secondary">Loading...</p>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  )
}

function CallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const handledRef = useRef(false)

  useEffect(() => {
    if (handledRef.current) return
    handledRef.current = true

    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const errorParam = searchParams.get('error')

    if (errorParam) {
      logger.error('[CALLBACK] OAuth error', { error: errorParam })
      setError(errorParam)
      return
    }

    if (!code || !state) {
      setError('Missing code or state parameter')
      return
    }

    async function exchangeCode() {
      try {
        const result = await authService.handleCallback(code!, state!)
        if (result) {
          const locale = getPreferredLocale()
          router.replace(`/${locale}/my-day`)
        } else {
          setError('Authentication failed — unknown error')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed')
      }
    }

    exchangeCode()
  }, [searchParams, router])

  if (error) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error/10">
          <svg className="h-7 w-7 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-textcolor-primary">Authentication Error</h1>
        <p className="mt-2 text-textcolor-secondary">{error}</p>
        <Button onClick={() => router.replace(`/${getPreferredLocale()}/auth`)} className="mt-6">
          Back to Sign In
        </Button>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      <p className="mt-4 text-textcolor-secondary">Completing sign in...</p>
    </div>
  )
}
