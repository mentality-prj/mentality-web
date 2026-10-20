'use client'

import { useEffect, useRef, useState } from 'react'
import { CircleCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { useAuth } from '@/context/AuthProvider'
import { SectionCard } from '@/ds/components/SectionCard'
import { Link } from '@/i18n/navigation'
import {
  checkDailyHabit,
  chooseDailyHabit,
  DAILY_HABIT_KINDS,
  type DailyHabitKind,
  type DailyHabitToday,
  removeDailyHabit,
} from '@/requests/dailyHabits'
import { getLocalDayKey } from '@/utils/timeZone'

type Props = {
  initialHabits: DailyHabitToday[]
  timeZone: string | null
  initialDayKey: string | null
  failed: boolean
}

const RELATED_PAGES: Partial<Record<DailyHabitKind, string>> = {
  breathing: '/guide/breathing',
  journaling: '/diary',
}

/**
 * User-owned, voluntarily selected daily actions. Nothing happens on visiting
 * an exercise or leaving My Day; every daily check requires an explicit tap.
 */
export function DailyHabitsCard({ initialHabits, timeZone, initialDayKey, failed }: Props) {
  const t = useTranslations('components.DailyCard.habits')
  const { session } = useAuth()
  const router = useRouter()
  const [habits, setHabits] = useState<DailyHabitToday[]>(initialHabits)
  const [busy, setBusy] = useState<DailyHabitKind | null>(null)
  const requestPending = useRef(false)
  const [notice, setNotice] = useState<'saved' | 'failed' | 'login' | null>(null)

  // On returning to an open PWA after midnight, refresh server-computed dates.
  useEffect(() => {
    if (!timeZone || !initialDayKey) return
    const refreshIfNewDay = () => {
      if (document.visibilityState === 'hidden') return
      const current = getLocalDayKey(new Date(), timeZone)
      if (current && current !== initialDayKey) router.refresh()
    }
    window.addEventListener('focus', refreshIfNewDay)
    document.addEventListener('visibilitychange', refreshIfNewDay)
    return () => {
      window.removeEventListener('focus...[truncated]