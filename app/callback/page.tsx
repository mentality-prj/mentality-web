'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { consumeLandingIntent } from '@/helpers/landingIntent'
import { routing } from '@/i18n/routing'
import { authService } from '@/lib/auth'
import { logger } from '@/lib/logger'
import callbackEn from '@/messages/en/pages/Callback.json'
import callbackPl from '@/messages/pl/pages/Callback.json'
import callbackUk from '@/messages/uk/pages/Callback.json'
import { SessionVerificationUnavailableError } from '@/requests/auth'
import { SupportedLanguage, supportedLanguages } from '@/types/languages'
import { Button } from '@/ui/button'

const callbackMessages: Record<string, typeof callbackEn> = {
  en: callbackEn,
  uk: callbackUk,
  pl: callbackPl,
}

const LOCALE_COOKIE = 'NEXT_LOCALE'

function getPreferredLocale(): SupportedLanguage {
  if (typeof document === 'undefined') {
    return routing.defaultLocale as SupportedLanguage
  }

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
  return routing.defaultLocale as SupportedLanguage
}

function getMessages() {
  return callbackMessages[getPreferredLocale()] ?? callbackEn
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center">
          <div className="border-primary/30 border-t-primary mx-auto h-10 w-10 animate-spin rounded-full border-4" />
          <p className="text-textcolor-secondary mt-4">{callbackEn.loading}</p>
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
  const [canRetrySession, setCanRetrySession] = useState(false)
  const [retryingSession, setRetryingSession] = useState(false)
  const handledRef = useRef(false)

  useEffect(() => {
    if (handledRef.current) return
    handledRef.current = true

    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (errorParam) {
      logger.error('[CALLBACK] OAuth error', { error: errorParam, errorDescription })
      setError(errorDescription || errorParam)
      return
    }

    if (!code || !state) {
      setError(getMessages().missingParams)
      return
    }

    async function exchangeCode() {
      try {
        const result = await authService.handleCallback(code!, state!)
        if (result) {
          const locale = getPreferredLocale()
          router.replace(`/${locale}${consumeLandingIntent() ?? '/my-day'}`)
        } else {
          setError(getMessages().unknownError)
        }
      } catch (err) {
        if (err instanceof SessionVerificationUnavailableError) {
          setCanRetrySession(true)
          setError(getMessages().sessionUnavailable)
        } else {
          setError(err instanceof Error ? err.message : getMessages().unknownError)
        }
      }
    }

    exchangeCode()
  }, [searchParams, router])

  // OAuth authorization codes are single-use. Only revalidate the existing
  // server-owned cookie; never try to exchange the callback code a second time.
  async function retryVerifiedSession() {
    if (retryingSession) return
    setRetryingSession(true)
    try {
      const user = await authService.getUser()
      if (user) {
        router.replace(`/${getPreferredLocale()}${consumeLandingIntent() ?? '/my-day'}`)
        return
      }
      setCanRetrySession(false)
      setError(getMessages().unknownError)
    } catch (err) {
      setError(
        err instanceof SessionVerificationUnavailableError
          ? getMessages().sessionUnavailable
          : getMessages().unknownError
      )
    } finally {
      setRetryingSession(false)
    }
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="bg-error/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
          <svg className="text-error h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-textcolor-primary text-2xl font-bold">{getMessages().authError}</h1>
        <p className="text-textcolor-secondary mt-2">{error}</p>
        {canRetrySession && (
          <Button onClick={() => void retryVerifiedSession()} disabled={retryingSession} className="mt-6">
            {getMessages().retrySession}
          </Button>
        )}
        <Button onClick={() => router.replace(`/${getPreferredLocale()}/auth`)} className="mt-6">
          {getMessages().backToSignIn}
        </Button>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="border-primary/30 border-t-primary mx-auto h-10 w-10 animate-spin rounded-full border-4" />
      <p className="text-textcolor-secondary mt-4">{getMessages().completingSignIn}</p>
    </div>
  )
}
