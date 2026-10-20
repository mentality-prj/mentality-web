'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, CircleCheck, Footprints, MonitorOff, NotebookPen, Plus, RotateCcw, Wind } from 'lucide-react'
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
  getDailyHabits,
  removeDailyHabit,
} from '@/requests/dailyHabits'
import { getLocalDayKey, getVerifiedBrowserTimeZone } from '@/utils/timeZone'

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
 * Optional personal activities: load using verified browser local day and existing
 * authenticated BFF. Update visible state only after a validated API response.
 */
export function DailyHabitsCard() {
  const t = useTranslations('components.DailyCard.habits')
  const { session, status } = useAuth()
  const [habits, setHabits] = useState<DailyHabitToday[]>([])
  const [timeZone, setTimeZone] = useState<string | null>(null)
  const [dayKey, setDayKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [busy, setBusy] = useState<DailyHabitKind | null>(null)
  const requestPending = useRef(false)
  const [notice, setNotice] = useState<'saved' | 'failed' | 'login' | null>(null)

  const reload = useCallback(async () => {
    if (requestPending.current || status === 'loading') return
    const zone = getVerifiedBrowserTimeZone()
    const today = getLocalDayKey(new Date(), zone)
    setTimeZone(zone)
    setDayKey(today)
    setNotice(null)
    if (!zone || !today || !session?.user) {
      setHabits([])
      setFailed(false)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const result = await getDailyHabits(session, zone)
      if ('error' in result) {
        setFailed(true)
      } else {
        setHabits(result.data)
        setFailed(false)
      }
    } catch {
      setFailed(true)
    } finally {
      setLoading(false)
    }
  }, [session, status])

  useEffect(() => {
    void reload()
  }, [reload])

  // Recheck the actual local date after returning to a long-running PWA tab.
  useEffect(() => {
    const refreshIfNewDay = () => {
      if (document.visibilityState === 'hidden' || requestPending.current) return
      const nowZone = getVerifiedBrowserTimeZone()
      const nowDay = getLocalDayKey(new Date(), nowZone)
      if (nowZone !== timeZone || nowDay !== dayKey) void reload()
    }
    window.addEventListener('focus', refreshIfNewDay)
    document.addEventListener('visibilitychange', refreshIfNewDay)
    return () => {
      window.removeEventListener('focus', refreshIfNewDay)
      document.removeEventListener('visibilitychange', refreshIfNewDay)
    }
  }, [dayKey, reload, timeZone])

  const change = async (kind: DailyHabitKind, action: 'select' | 'check' | 'undo' | 'remove') => {
    if (requestPending.current || loading || failed) return
    const freshZone = getVerifiedBrowserTimeZone()
    const freshDay = getLocalDayKey(new Date(), freshZone)
    if (!freshDay || freshZone !== timeZone || freshDay !== dayKey) {
      void reload()
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
      if (action === 'remove') {
        const removed = await removeDailyHabit(session, kind)
        if ('error' in removed) {
          setNotice('failed')
          return
        }
        setHabits((previous) => previous.filter((entry) => entry.kind !== kind))
        setNotice('saved')
        return
      }

      const result = action === 'select'
        ? await chooseDailyHabit(session, kind, freshZone)
        : await checkDailyHabit(session, kind, action === 'check', freshZone)
      if ('error' in result) {
        setNotice('failed')
        return
      }
      const next: DailyHabitToday = { kind, doneToday: result.data.doneToday }
      setHabits((previous) => [...previous.filter((entry) => entry.kind !== kind), next])
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
            <p className="max-w-[58ch] text-[13px] leading-5 text-textcolor-secondary sm:text-sm">
              {t('description')}
            </p>
          </div>
          {loading ? (
            <p role="status" className="text-sm text-textcolor-secondary">
              {t('loading')}
            </p>
          ) : !timeZone || !dayKey ? (
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
                onClick={() => void reload()}
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
