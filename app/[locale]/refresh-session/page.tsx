'use client'

import { Suspense, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'

import { useAuth } from '@/context/AuthProvider'

function safeReturnPath(raw: string | null, locale: string): string {
  const fallback = `/${locale}/my-day`
  if (!raw || raw.length > 2048 || !raw.startsWith(`/${locale}/`) || raw.startsWith('//')) return fallback
  if (raw.startsWith(`/${locale}/refresh-session`) || /[\r\n\\]/.test(raw)) return fallback
  return raw
}

function SessionRecovery() {
  const { status } = useAuth()
  const locale = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('pages.Callback')

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'authenticated') {
      router.replace(safeReturnPath(searchParams.get('returnTo'), locale))
    } else {
      router.replace(`/${locale}/auth`)
    }
  }, [status, locale, router, searchParams])

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
