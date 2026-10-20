'use client'

import { useEffect, useRef, useState } from 'react'
import { CircleCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/context/AuthProvider'
import { SectionCard } from '@/ds/components/SectionCard'
import { Link } from '@/i18n/navigation'
import {
  checkDailyHabit,
  chooseDailyHabit,
  DAILY_HABIT_KINDS,
  removeDailyHabit,
  type DailyHabitKind,
  type DailyHabitToday,
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
      window.removeEventListener('focus', refreshIfNewDay)
      document.removeEventListener('visibilitychange', refreshIfNewDay)
    }
  }, [initialDayKey, router, timeZone])

  const change = async (kind: DailyHabitKind, action: 'select' | 'check' | 'undo' | 'remove') => {
    if (requestPending.current || failed || !timeZone || !initialDayKey) return
    if (getLocalDayKey(new Date(), timeZone) !== initialDayKey) {
      router.refresh()
      return
    }
    if (!session?.user) {
      setNotice('login')
      return
    }

    requestPending.current = true
    setBusy(kind)
    setNotice(null)
    try {
      const response =
        action === 'select'
          ? await chooseDailyHabit(session, kind, timeZone)
          : action === 'remove'
            ? await removeDailyHabit(session, kind)
            : await checkDailyHabit(session, kind, action === 'check', timeZone)

      if ('error' in response) {
        setNotice('failed')
        return
      }
      if (action === 'remove') {
        setHabits((previous) => previous.filter((habit) => habit.kind !== kind))
      } else {
        if (!response.data || !('doneToday' in response.data) || typeof response.data.doneToday !== 'boolean') {
          setNotice('failed')
          return
        }
        // Preserve other selected actions and trust only backend-acknowledged state.
        const updated: DailyHabitToday = { kind, doneToday: response.data.doneToday }
        setHabits((previous) => [...previous.filter((habit) => habit.kind !== kind), updated])
      }
      setNotice('saved')
    } catch {
      setNotice('failed')
    } finally {
      requestPending.current = false
      setBusy(null)
    }
  }

  return (
    <section aria-labelledby="daily-habits-heading">
      <SectionCard>
        <div className="flex flex-col gap-md">
          <div>
            <h2 id="daily-habits-heading" className="text-lg font-semibold">{t('title')}</h2>
            <p className="mt-1 text-sm leading-relaxed text-textcolor-secondary">{t('description')}</p>
          </div>

          {!timeZone || !initialDayKey ? (
            <p role="status" className="text-sm text-textcolor-secondary">{t('unknownDay')}</p>
          ) : failed ? (
            <p role="alert" className="text-sm text-textcolor-secondary">{t('loadError')}</p>
          ) : (
            <ul className="flex flex-col gap-sm">
              {DAILY_HABIT_KINDS.map((kind) => {
                const record = habits.find((habit) => habit.kind === kind)
                const isBusy = busy !== null
                const href = RELATED_PAGES[kind]
                return (
                  <li key={kind} className="rounded-xl border border-current/10 p-3">
                    <div className="flex flex-col gap-sm">
                      <div>
                        <h3 className="font-medium">{t(`options.${kind}.title`)}</h3>
                        <p className="text-sm text-textcolor-secondary">{t(`options.${kind}.description`)}</p>
                      </div>
                      {record ? (
                        <>
                          <span className="inline-flex items-center gap-xs text-xs text-textcolor-secondary">
                            {record.doneToday && <CircleCheck size={16} className="text-primary" aria-hidden="true" />}
                            {t(record.doneToday ? 'doneToday' : 'selected')}
                          </span>
                          <div className="flex flex-wrap items-center gap-sm">
                            <button
                              type="button"
                              disabled={isBusy}
                              aria-pressed={record.doneToday}
                              onClick={() => void change(kind, record.doneToday ? 'undo' : 'check')}
                              className="min-h-11 rounded-xl border border-primary px-3 py-2 text-sm font-medium text-primary focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
                            >
                              {t(record.doneToday ? 'undo' : 'markToday')}
                            </button>
                            {href && (
                              <Link href={href} className="inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4">
                                {t('openActivity')}
                              </Link>
                            )}
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => void change(kind, 'remove')}
                              className="min-h-11 text-sm text-textcolor-secondary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
                            >
                              {t('remove')}
                            </button>
                          </div>
                        </>
                      ) : (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => void change(kind, 'select')}
                          className="min-h-11 w-fit rounded-xl border border-current/20 px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
                        >
                          {t('choose')}
                        </button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
          <p className="text-xs leading-relaxed text-textcolor-secondary">{t('noPressure')}</p>
          {notice && (
            <p role={notice === 'failed' ? 'alert' : 'status'} aria-live="polite" className="text-sm text-textcolor-secondary">
              {t(notice)}
            </p>
          )}
        </div>
      </SectionCard>
    </section>
  )
}
