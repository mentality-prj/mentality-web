'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

import { useRouter } from '@/i18n/navigation'

const POLL_INTERVAL_MS = 3_000
const MAX_RETRIES = 5

export function StoryNotReady() {
  const t = useTranslations('components.MoodStoryCard.notReady')
  const router = useRouter()
  const retriesRef = useRef(0)

  useEffect(() => {
    const timer = setInterval(() => {
      if (retriesRef.current >= MAX_RETRIES) {
        clearInterval(timer)
        return
      }
      retriesRef.current++
      router.refresh()
    }, POLL_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <p className="text-base font-medium">{t('title')}</p>
      <p className="text-textcolor-tertiary text-sm">{t('description')}</p>
    </div>
  )
}
