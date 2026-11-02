'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, CircleCheck, Footprints, MonitorOff, NotebookPen, Plus, RotateCcw, Wind } from 'lucide-react'
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

const HABIT_ICONS = {
  breathing: Wind,
  movement: Footprints,
  journaling: NotebookPen,
  screenBreak: MonitorOff,
} as const

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
    <section aria-labelledby="daily-habits-heading" className="min-w-0">
      <SectionCard className="!rounded-[20px] !p-4 sm:!p-5">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="space-y-1">
            <h2
              id="daily-habits-heading"
              className="text-[17px] font-semibold leading-6 text-textcolor-primary sm:text-lg"
            >
              {t('title')}
            </h2>
            <p className="max-w-[58ch] text-[13px] leading-5 text-textcolor-secondary sm:text-sm">{t('description')}</p>
          </div>
          {!timeZone || !initialDayKey ? (
            <p role="status" className="text-sm text-textcolor-secondary">
              {t('unknownDay')}
            </p>
          ) : failed ? (
            <div className="flex flex-wrap items-center gap-3">
              <p role="alert" className="text-sm text-textcolor-secondary">
                {t('loadError')}
              </p>
              <button
                type="button"
                onClick={() => router.refresh()}
                className="inline-flex min-h-11 items-center rounded-[10px] px-3 text-sm font-semibold text-primary hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {t('retry')}
              </button>
            </div>
          ) : (
            <ul className="grid min-w-0 gap-2.5">
              {DAILY_HABIT_KINDS.map((kind) => {
                const record = habits.find((entry) => entry.kind === kind)
                const isBusy = busy !== null
                const href = RELATED_PAGES[kind]
                const HabitIcon = HABIT_ICONS[kind]
                return (
                  <li key={kind} className="min-w-0 rounded-[14px] border border-border bg-white px-3.5 py-3 sm:px-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-secondary text-primary"
                      >
                        <HabitIcon className="h-[18px] w-[18px]" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[15px] font-semibold leading-5 text-textcolor-primary">
                          {t(`options.${kind}.title`)}
                        </h3>
                        <p className="mt-0.5 text-[13px] leading-[19px] text-textcolor-secondary">
                          {t(`options.${kind}.description`)}
                        </p>
                      </div>
                    </div>
                    {record ? (
                      <div className="mt-2 flex flex-col items-start gap-1.5 pl-12">
                        <span className="inline-flex items-center gap-1.5 text-xs leading-4 text-textcolor-secondary">
                          {record.doneToday && <CircleCheck size={14} className="text-primary" aria-hidden="true" />}
                          {t(record.doneToday ? 'doneToday' : 'selected')}
                        </span>
                        <div className="flex w-full flex-wrap items-center gap-x-2 gap-y-1">
                          <button
                            type="button"
                            disabled={isBusy}
                            aria-pressed={record.doneToday}
                            onClick={() => void change(kind, record.doneToday ? 'undo' : 'check')}
                            className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-[10px] px-3 text-[13px] font-semibold leading-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 ${
                              record.doneToday
                                ? 'bg-secondary text-primary hover:bg-secondary-hover'
                                : 'bg-primary text-primary-foreground hover:bg-primary-hover'
                            }`}
                          >
                            {record.doneToday ? (
                              <RotateCcw size={15} aria-hidden="true" />
                            ) : (
                              <Check size={15} aria-hidden="true" />
                            )}
                            {t(record.doneToday ? 'undo' : 'markToday')}
                          </button>
                          {href && (
                            <Link
                              href={href}
                              className="inline-flex min-h-11 items-center rounded-[10px] px-2 text-[13px] font-medium text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                              {t('openActivity')}
                            </Link>
                          )}
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => void change(kind, 'remove')}
                            className="inline-flex min-h-11 items-center rounded-[10px] px-2 text-[13px] text-textcolor-secondary hover:bg-background-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
                          >
                            {t('remove')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 pl-12">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => void change(kind, 'select')}
                          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-[10px] bg-secondary px-3 text-[13px] font-semibold leading-5 text-primary transition-colors hover:bg-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
                        >
                          <Plus size={15} aria-hidden="true" />
                          {t('choose')}
                        </button>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
          <p className="text-xs leading-[18px] text-textcolor-secondary">{t('noPressure')}</p>
          {notice && (
            <p
              role={notice === 'failed' ? 'alert' : 'status'}
              aria-live="polite"
              className="text-[13px] leading-5 text-textcolor-secondary"
            >
              {t(notice)}
            </p>
          )}
        </div>
      </SectionCard>
    </section>
  )
}
