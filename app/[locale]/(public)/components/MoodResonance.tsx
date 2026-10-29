'use client'

import { type CSSProperties, type ReactNode, useCallback, useRef, useState } from 'react'
import { BookOpenText, CloudRain, Heart, Sun, Wind } from 'lucide-react'
import { useTranslations } from 'next-intl'

/**
 * "Resonance" — Dzvin means a bell. Soft rings spread from the hero card in a
 * slow breathing rhythm; the mood slider re-tints the whole hero and sends a
 * ripple. Nothing is stored: this is a local, decorative demo.
 */

type Rgb = [number, number, number]
const hex = (value: string): Rgb => [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16)) as Rgb
const PALETTES: Record<'low' | 'mid' | 'high', [Rgb, Rgb, Rgb]> = {
  low: [hex('#a9c4f5'), hex('#c3b5f0'), hex('#b3dfe9')],
  mid: [hex('#ffb9a9'), hex('#cca7ff'), hex('#8fe8d7')],
  high: [hex('#ffcf8a'), hex('#ffb3c7'), hex('#b9f0c6')],
}

const mix = (a: Rgb, b: Rgb, t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(' ')})`

export function moodPalette(mood: number): [string, string, string] {
  const clamped = Math.max(0, Math.min(100, mood))
  const [from, to, t] =
    clamped <= 50 ? [PALETTES.low, PALETTES.mid, clamped / 50] : [PALETTES.mid, PALETTES.high, (clamped - 50) / 50]
  return [0, 1, 2].map((i) => mix(from[i], to[i], t)) as [string, string, string]
}

const RINGS = [0, 1, 2, 3, 4]

export function MoodResonance({ children, className }: { children: ReactNode; className?: string }) {
  const t = useTranslations('pages.Landing.Platform.visual')
  const [mood, setMood] = useState(55)
  const [pulses, setPulses] = useState<number[]>([])
  const lastPulse = useRef(0)
  const [c1, c2, c3] = moodPalette(mood)

  const onMood = useCallback((value: number) => {
    setMood(value)
    const now = Date.now()
    if (now - lastPulse.current < 280) return
    lastPulse.current = now
    setPulses((current) => [...current.slice(-3), now])
    window.setTimeout(() => setPulses((current) => current.filter((id) => id !== now)), 1700)
  }, [])

  const style = { '--r1': c1, '--r2': c2, '--r3': c3 } as CSSProperties

  const card = (
    <div className="relative mx-auto w-full max-w-[520px] py-4" style={style}>
      <svg
        aria-hidden="true"
        viewBox="-400 -400 800 800"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[190%] w-[190%] -translate-x-1/2 -translate-y-1/2 overflow-visible"
      >
        {RINGS.map((ring) => (
          <circle
            key={ring}
            r="200"
            fill="none"
            strokeWidth="1.5"
            className="dzvin-ring transition-[stroke] duration-700"
            style={{ stroke: 'var(--r2)', animationDelay: `${ring * -1.6}s` }}
          />
        ))}
        {pulses.map((id) => (
          <circle
            key={id}
            r="200"
            fill="none"
            strokeWidth="3"
            className="dzvin-pulse"
            style={{ stroke: 'var(--r1)' }}
          />
        ))}
      </svg>
      <div className="relative overflow-hidden rounded-[32px] border border-white/90 bg-white/90 p-5 shadow-[0_35px_75px_rgba(93,78,136,0.18)] backdrop-blur-sm tablet:p-7">
        <div className="mb-5 flex items-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5e2fc] text-[#8f53a7]">
            <Heart aria-hidden size={23} strokeWidth={1.8} />
          </div>
        </div>
        <h2 className="text-[1.45rem] font-semibold leading-tight tracking-tight text-[#393451] tablet:text-[1.65rem]">
          {t('title')}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#756d84]">{t('subtitle')}</p>

        <div
          className="mt-6 rounded-[22px] p-4 transition-[background] duration-700"
          style={{
            background: `linear-gradient(120deg, color-mix(in srgb, var(--r1) 28%, white), color-mix(in srgb, var(--r2) 24%, white))`,
          }}
        >
          <label htmlFor="dzvin-mood" className="mb-3 block text-sm font-semibold text-[#5b4a6e]">
            {t('checkin')}
          </label>
          <div className="flex items-center gap-3">
            <CloudRain aria-hidden size={22} strokeWidth={1.7} className="shrink-0 text-[#6577a8]" />
            <input
              id="dzvin-mood"
              type="range"
              min={0}
              max={100}
              value={mood}
              onChange={(event) => onMood(Number(event.target.value))}
              aria-valuetext={mood < 34 ? t('moodLow') : mood > 66 ? t('moodHigh') : t('moodMid')}
              className="dzvin-mood-range h-11 flex-1 cursor-pointer"
              style={{ '--track': `linear-gradient(90deg, ${PALETTES_CSS})` } as CSSProperties}
            />
            <Sun aria-hidden size={22} strokeWidth={1.7} className="shrink-0 text-[#c27a2c]" />
          </div>
          <div className="mt-1 flex justify-between text-xs text-[#6f6680]">
            <span>{t('moodLow')}</span>
            <span>{t('moodHigh')}</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-[20px] border border-[#ebdfed] bg-[#faf6fd] p-4">
            <BookOpenText aria-hidden size={22} strokeWidth={1.7} className="text-[#8b69aa]" />
            <p className="mt-3 text-sm font-semibold text-[#5a4b69]">{t('journal')}</p>
          </div>
          <div className="rounded-[20px] border border-[#d4ebe3] bg-[#edf9f4] p-4">
            <Wind aria-hidden size={22} strokeWidth={1.7} className="text-[#328d78]" />
            <p className="mt-3 text-sm font-semibold text-[#426b61]">{t('practice')}</p>
          </div>
        </div>
        <p className="mt-4 text-xs text-[#8a8297]">{t('moodHint')}</p>
      </div>
    </div>
  )

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" style={style}>
        <div
          className="absolute -left-24 -top-40 h-[430px] w-[520px] rounded-full opacity-70 blur-[95px] transition-colors duration-700"
          style={{ backgroundColor: 'var(--r1)' }}
        />
        <div
          className="absolute -bottom-52 left-[22%] h-[440px] w-[540px] rounded-full opacity-60 blur-[95px] transition-colors duration-700"
          style={{ backgroundColor: 'var(--r2)' }}
        />
        <div
          className="absolute -right-32 top-[10%] h-[540px] w-[480px] rounded-full opacity-60 blur-[95px] transition-colors duration-700"
          style={{ backgroundColor: 'var(--r3)' }}
        />
      </div>
      <div className={className}>
        {children}
        {card}
      </div>
    </>
  )
}

const PALETTES_CSS = '#a9c4f5, #cca7ff 50%, #ffcf8a'
