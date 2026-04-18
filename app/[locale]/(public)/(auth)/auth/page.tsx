'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

import { useAuth } from '@/context/AuthProvider'

export default function AuthPage() {
  const { login } = useAuth()
  const t = useTranslations('pages.Auth')
  const initiated = useRef(false)

  useEffect(() => {
    if (initiated.current) return
    initiated.current = true
    login()
  }, [login])

  return (
    <div className="text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      <p className="mt-4 text-textcolor-secondary">{t('redirecting')}</p>
    </div>
  )
}
