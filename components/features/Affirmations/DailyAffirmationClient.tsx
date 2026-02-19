import { cookies } from 'next/headers'

import { auth } from '@/auth'
import { getRandomAffirmation } from '@/requests/affirmations'
import { AffirmationEntity } from '@/types/api-responses'
import { COOKIE_KEY, getTodayDate, StoredAffirmation } from '@/utils/dailyAffirmation'

import { DailyAffirmationRandomClient } from './DailyAffirmationRandomClient'

export const DailyAffirmationClient = async () => {
  const session = await auth()
  const cookieStore = cookies()

  // Check if there's a saved affirmation for today
  const storedCookie = cookieStore.get(COOKIE_KEY)
  let storedAffirmation: AffirmationEntity | null = null
  let isUsedToday = false

  if (storedCookie) {
    try {
      const parsed: StoredAffirmation = JSON.parse(storedCookie.value)
      if (parsed.date === getTodayDate()) {
        storedAffirmation = parsed.affirmation
        isUsedToday = true
      }
    } catch {
      // Invalid cookie, ignore
    }
  }

  // If no saved affirmation for today, load a new one
  const initialAffirmation =
    storedAffirmation ||
    (async () => {
      const res = await getRandomAffirmation(session)
      return 'error' in res ? null : res.data
    })()

  const affirmation = await initialAffirmation
  if (!affirmation) return null

  const loadNewAffirmation = async (): Promise<AffirmationEntity | null> => {
    'use server'
    const session = await auth()
    const res = await getRandomAffirmation(session)
    if ('error' in res) return null
    return res.data
  }

  return (
    <DailyAffirmationRandomClient
      randomAffirmation={affirmation}
      onLoadNewAffirmation={loadNewAffirmation}
      initialShowState={isUsedToday}
    />
  )
}
