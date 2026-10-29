'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

const TOTAL_SECONDS = 30
const BREATH_CYCLE_SECONDS = 10
const INHALE_SECONDS = 4
const TICK_MILLISECONDS = 250

export function BreathingPreview({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const t = useTranslations('pages.Landing.Preview')
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (startedAt === null) return

    const sync = () => {
      const seconds = Math.min(TOTAL_SECONDS, Math.floor((Date.now() - startedAt) / 1000))
      setElapsed(seconds)
      if (seconds >= TOTAL_SECONDS) setStartedAt(null)
    }

    sync()
    const interval = window.setInterval(sync, TICK_MILLISECONDS)
    return () => window.clearInterval(interval)
  }, [startedAt])

  const running = startedAt !== null
  const completed = elapsed >= TOTAL_SECONDS
  const cycleSecond = elapsed % BREATH_CYCLE_SECONDS
  const inhaling = cycleSecond < INHALE_SECONDS
  const phaseSeconds = inhaling ? INHALE_SECONDS - cycleSecond : BREATH_CYCLE_SECONDS - cycleSecond

  const start = () => {
    setElapsed(0)
    setStartedAt(Date.now())
  }

  const stop = () => {
    setStartedAt(null)
    setElapsed(0)
  }

  return (
    <section
      id="try-now"
      aria-labelledby="breathing-preview-heading"
      className="scroll-mt-6 rounded-[30px] border border-white/80 bg-white/80 p-5 shadow-[0_22px_55px_rgba(70,100,153,0.12)] backdrop-blur-md tablet:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="breathing-preview-heading" className="text-xl font-semibold text-textcolor-primary">
            {t('heading')}
          </h2>
          <p className="mt-1 text-sm text-textcolor-secondary">{t('duration')}</p>
        </div>
        <span className="rounded-full border border-[var(--outline-secondary)] px-3 py-1 text-xs text-textcolor-secondary">
          {t('withoutAccount')}
        </span>
      </div>

      <div className="my-6 flex justify-center">
        <div className="flex h-44 w-44 flex-col items-center justify-center rounded-full border-[5px] border-[#b2e8e8] bg-[radial-gradient(circle_at_34%_26%,#ffffff_0%,#e3f9f4_55%,#d0e8fd_100%)] text-center shadow-[0_18px_42px_rgba(59,176,177,0.16)]">
          <span aria-live="polite" aria-atomic="true" className="text-base font-medium text-textcolor-primary">
            {running ? t(inhaling ? 'inhale' : 'exhale') : t(completed ? 'done' : 'ready')}
          </span>
          <span className="mt-2 text-4xl font-semibold tabular-nums text-textcolor-primary" aria-hidden="true">
            {running ? phaseSeconds : completed ? '✓' : TOTAL_SECONDS}
          </span>
        </div>
      </div>

      <div
        role="progressbar"
        aria-label={t('progress')}
        aria-valuemin={0}
        aria-valuemax={TOTAL_SECONDS}
        aria-valuenow={elapsed}
        className="h-1.5 overflow-hidden rounded-full bg-white"
      >
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#29b7a9,#6670e9)]"
          style={{ width: String(Math.round((elapsed / TOTAL_SECONDS) * 100)) + '%' }}
        />
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {running ? (
          <button
            type="button"
            onClick={stop}
            className="min-h-12 rounded-full border border-[var(--outline-secondary)] bg-white px-5 py-3 text-sm font-semibold text-textcolor-primary focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {t('stop')}
          </button>
        ) : (
          <button
            type="button"
            onClick={start}
            className="min-h-12 rounded-full bg-[linear-gradient(110deg,#7246dd,#4470e4)] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(93,78,210,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {t(completed ? 'restart' : 'start')}
          </button>
        )}
        {completed && (
          <Link
            href={isAuthenticated ? Routes.MYDAY : Routes.AUTH}
            className="inline-flex min-h-11 items-center justify-center text-sm font-semibold text-primary underline underline-offset-4"
          >
            {t('next')}
          </Link>
        )}
      </div>
      <p className="mt-4 text-xs text-textcolor-secondary">{t('private')}</p>
    </section>
  )
}
