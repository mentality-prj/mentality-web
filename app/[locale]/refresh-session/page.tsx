'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

import { useAuth } from '@/context/AuthProvider'
import { authService } from '@/lib/auth'

function safeReturnPath(raw: string | null, locale: string): string {
  const fallback = `/${locale}/my-day`
  if (!raw || raw.length > 2048 || /[\r\n\\]/.test(raw)) return fallback

  try {
    // WHATWG URL resolves encoded dot segments before we apply locale and
    // route restrictions, preventing redirects to another tenant/locale.
    const base = 'https://internal.dzvin.invalid'
    const normalized = new URL(raw, base)
    if (normalized.origin !== base) return fallback
    if (!normalized.pathname.startsWith(`/${locale}/`)) return fallback
    if (
      normalized.pathname === `/${locale}/refresh-session` ||
      normalized.pathname.startsWith(`/${locale}/refresh-session/`)
    ) {
      return fallback
    }
    return normalized.pathname + normalized.search + normalized.hash
  } catch {
    return fallback
  }
}

function SessionRecovery() {
  const { status, ensureFreshSession } = useAuth()
  const [attempt, setAttempt] = useState(0)
  const locale = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('pages.Callback')

  useEffect(() => {
    if (status === 'loading') return
    // React status can be stale when another tab signs in. Always inspect
    // the current cookie before deciding that recovery is impossible.
    let cancelled = false
    let retryTimer: ReturnType<typeof setTimeout> | undefined
    const recover = async () => {
      // A preserved layout can report "authenticated" while its cookie has
      // already expired. Await real rotation and backend role verification.
      const ready = await ensureFreshSession()
      if (cancelled) return
      if (ready) {
        router.replace(safeReturnPath(searchParams.get('returnTo'), locale))
        return
      }

      // Only a confirmed absent cookie redirects to login. A temporary
      // metadata/validation outage keeps the recovery route retryable.
      try {
        const metadata = await authService.getStoredTokens()
        if (cancelled) return
        if (!metadata) {
          router.replace(`/${locale}/auth`)
          return
        }
      } catch {
        // A transient network failure is not evidence of logout.
      }
      if (!cancelled) retryTimer = setTimeout(() => setAttempt((previous) => previous + 1), 15_000)
    }
    void recover()
    return () => {
      cancelled = true
      if (retryTimer) clearTimeout(retryTimer)
    }
  }, [status, locale, router, searchParams, ensureFreshSession, attempt])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center" aria-live="polite">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      <p className="mt-4 text-textcolor-secondary">{t('completingSignIn')}</p>
    </div>
  )
}

export default function SessionRecoveryPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" />}>
      <SessionRecovery />
    </Suspense>
  )
}
