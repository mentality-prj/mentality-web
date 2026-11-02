'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

import { useAuth } from '@/context/AuthProvider'
import { useRouter } from '@/i18n/navigation'
import { getTodayMoodStory } from '@/requests/moodStory'
import type { CustomSession } from '@/types/auth'
import { Button } from '@/ui/button'
import { getVerifiedBrowserTimeZone } from '@/utils/timeZone'

const POLL_INTERVAL_MS = 3_000
const MAX_ATTEMPTS = 20

export function StoryNotReady() {
  const t = useTranslations('components.MoodStoryCard.notReady')
  const retryText = useTranslations('components.MoodStoryCard.error')
  const router = useRouter()
  const { session } = useAuth()

  useEffect(() => {
    if (!session) return

    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    let attempts = 0

    const checkToday = async () => {
      const result = await getTodayMoodStory(session as CustomSession, getVerifiedBrowserTimeZone())
      if (cancelled) return

      if ('data' in result && result.data.screens.length > 0) {
        router.refresh()
        return
      }

      // Only retry when today's story is missing. Auth/server failures must not spin.
      if ('error' in result && result.status !== 404) return

      attempts += 1
      if (attempts < MAX_ATTEMPTS) {
        timer = setTimeout(checkToday, POLL_INTERVAL_MS)
      }
    }

    timer = setTimeout(checkToday, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      if (timer !== undefined) clearTimeout(timer)
    }
  }, [session, router])

  return (
    <div className="flex flex-col items-center gap-xs py-6 text-center">
      <p className="text-base font-medium">{t('title')}</p>
      <p className="text-textcolor-tertiary text-sm">{t('description')}</p>
      <Button type="button" size="small" variant="secondary" onClick={() => router.refresh()}>
        {retryText('retryCta')}
      </Button>
    </div>
  )
}
