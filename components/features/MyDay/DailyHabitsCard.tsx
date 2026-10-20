'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { CircleCheck } from 'lucide-react'
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
      const result =
        action === 'select'
          ? await chooseDailyHabit(session, kind, freshZone)
          : action === 'remove'
            ? await removeDailyHabit(session, kind)
            : await checkDailyHabit(session, kind, action === 'check', freshZone)

      if ('error' in result) {
        setNotice('failed')
        return
      }
      if (action === 'remove') {
        setHabits((previous) => previous.filter((entry) => entry.kind !== kind))
      } else {
        if (!result.data || typeof result.data.doneToday !== 'boolean') {
          setNotice('failed')
          return
        }
        const next: DailyHabitToday = { kind, doneToday: result.data.doneToday }
        setHabits((previous) => [...previous.filter((entry) => entry.kind !== kind), next])
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
          {loading ? (
            <p role="status" className="text-sm text-textcolor-secondary">{t('loading')}</p>
          ) : !timeZone || !dayKey ? (
            <p role="status" className="text-sm text-textcolor-secondary">{t('unknownDay')}</p>
          ) : failed ? (
            <p role="alert" className="text-sm text-textcolor-secondary">{t('loadError')}</p>
          ) : (
            <ul className="flex flex-col gap-sm">
              {DAILY_HABIT_KINDS.map((kind) => {
                const record = habits.find((entry) => entry.kind === kind)
                const isBusy = busy !== null
                const href = RELATED_PAGES[kind]
                return (
                  <li key={kind} className="border-current/10 rounded-xl border p-3">
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
                          className="border-current/20 min-h-11 w-fit rounded-xl border px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
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
