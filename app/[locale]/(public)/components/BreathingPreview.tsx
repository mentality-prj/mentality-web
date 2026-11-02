'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

const TOTAL_SECONDS = 30
const BREATH_CYCLE_SECONDS = 10
const INHALE_SECONDS = 4
const TICK_MILLISECONDS = 250

type Props = {
  isAuthenticated?: boolean
  /** Called with the orb's bounds at the start of every inhale/exhale. */
  onBreath?: (orb: DOMRect) => void
}

export function BreathingPreview({ isAuthenticated = false, onBreath }: Props) {
  const t = useTranslations('pages.Landing.Preview')
  const orbRef = useRef<HTMLDivElement>(null)
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

  const phaseKey = running ? `${Math.floor(elapsed / BREATH_CYCLE_SECONDS)}-${inhaling ? 'in' : 'out'}` : 'idle'
  useEffect(() => {
    if (phaseKey === 'idle' || !orbRef.current) return
    onBreath?.(orbRef.current.getBoundingClientRect())
  }, [phaseKey, onBreath])

  const orbScale = !running ? 1 : inhaling ? 1.08 : 0.86

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
      className="mx-auto flex w-full max-w-[460px] scroll-mt-6 flex-col items-center text-center"
    >
      <div className="flex flex-col items-center gap-2">
        <h2 id="breathing-preview-heading" className="text-xl font-semibold text-[#21384f]">
          {t('heading')}
        </h2>
        <p className="text-sm text-[#45627a]">
          {t('duration')} · {t('withoutAccount')}
        </p>
      </div>

      <div className="my-8 flex h-64 w-64 items-center justify-center tablet:h-80 tablet:w-80">
        <div
          ref={orbRef}
          data-breath-orb
          className="flex h-56 w-56 flex-col items-center justify-center rounded-full border border-white/80 bg-[radial-gradient(120%_120%_at_30%_20%,rgba(255,255,255,0.95)_0%,rgba(236,251,250,0.75)_45%,rgba(176,228,236,0.55)_100%)] shadow-[inset_0_2px_3px_rgba(255,255,255,0.9),inset_0_-24px_48px_rgba(66,160,176,0.25),0_40px_80px_-30px_rgba(40,110,130,0.55)] backdrop-blur-md tablet:h-64 tablet:w-64"
          style={{
            transform: `scale(${orbScale})`,
            transition: `transform ${inhaling ? INHALE_SECONDS : BREATH_CYCLE_SECONDS - INHALE_SECONDS}s cubic-bezier(0.45, 0, 0.25, 1)`,
          }}
        >
          <span aria-live="polite" aria-atomic="true" className="text-base font-medium text-[#21384f]">
            {running ? t(inhaling ? 'inhale' : 'exhale') : t(completed ? 'done' : 'ready')}
          </span>
          <span className="mt-2 text-5xl font-semibold tabular-nums text-[#21384f]" aria-hidden="true">
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
        className="h-1.5 w-full max-w-[280px] overflow-hidden rounded-full bg-white/70"
      >
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#29b7a9,#6670e9)] transition-[width] duration-300"
          style={{ width: String(Math.round((elapsed / TOTAL_SECONDS) * 100)) + '%' }}
        />
      </div>

      <div className="mt-6 flex w-full flex-col items-center gap-3">
        {running ? (
          <button
            type="button"
            onClick={stop}
            className="min-h-12 min-w-44 rounded-full border border-white/90 bg-white/75 px-8 py-3 text-sm font-semibold text-[#21384f] backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6b58d9]"
          >
            {t('stop')}
          </button>
        ) : (
          <button
            type="button"
            onClick={start}
            className="min-h-12 min-w-44 rounded-full bg-[linear-gradient(110deg,#7545dd,#4368e6)] px-8 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(93,78,210,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6b58d9]"
          >
            {t(completed ? 'restart' : 'start')}
          </button>
        )}
        {completed && (
          <Link
            href={isAuthenticated ? Routes.MYDAY : Routes.AUTH}
            className="inline-flex min-h-11 items-center justify-center text-sm font-semibold text-[#4b3fb0] underline underline-offset-4"
          >
            {t('next')}
          </Link>
        )}
      </div>
      <p className="mt-4 text-xs text-[#45627a]">{t('private')}</p>
    </section>
  )
}
