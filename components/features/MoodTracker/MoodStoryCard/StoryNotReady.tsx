'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

import { useAuth } from '@/context/AuthProvider'
import { useRouter } from '@/i18n/navigation'
import { getLatestMoodStory } from '@/requests/moodStory'
import { CustomSession } from '@/types/auth'

const POLL_INTERVAL_MS = 3_000
const MAX_RETRIES = 5

export function StoryNotReady() {
  const t = useTranslations('components.MoodStoryCard.notReady')
  const router = useRouter()
  const retriesRef = useRef(0)
  const { session } = useAuth()

  useEffect(() => {
    if (!session) return

    let isCancelled = false
    retriesRef.current = 0

    const intervalId = setInterval(async () => {
      if (retriesRef.current >= MAX_RETRIES) {
        clearInterval(intervalId)
        return
      }
      retriesRef.current++

      const result = await getLatestMoodStory(session as CustomSession)
      if (!('error' in result) && result.data.screens.length > 0 && !isCancelled) {
        clearInterval(intervalId)
        router.refresh()
      }
    }, POLL_INTERVAL_MS)

    return () => {
      isCancelled = true
      clearInterval(intervalId)
    }
  }, [session, router])

  return (
    <div className="flex flex-col items-center gap-xs py-6 text-center">
      <p className="text-base font-medium">{t('title')}</p>
      <p className="text-textcolor-tertiary text-sm">{t('description')}</p>
    </div>
  )
}
