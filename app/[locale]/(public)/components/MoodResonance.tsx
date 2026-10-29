'use client'

import { type CSSProperties, type PointerEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

import { GlassMedallion } from './glass/GlassMedallion'
import { type WaterColors, WaterSurface, type WaterSurfaceHandle } from './water/WaterSurface'

/**
 * "Resonance" — Dzvin means a bell. The hero is a calm water surface: drops
 * fall behind the check-in card in a slow breathing rhythm, the mood slider
 * re-tints the water and sends a ripple, a tap on the background drops one
 * where you touched. Nothing is stored: this is a local, decorative demo.
 */

type Trio = [string, string, string]
const PALETTES: Record<'low' | 'mid' | 'high', Trio> = {
  low: ['#9db4ea', '#e4ecfb', '#f8fbff'],
  mid: ['#c6b2f1', '#fbe3f0', '#fff3e9'],
  high: ['#f3b58e', '#ffe4d4', '#fffaf0'],
}

const channel = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16)
const mixHex = (a: string, b: string, t: number) =>
  '#' +
  [0, 1, 2]
    .map((i) =>
      Math.round(channel(a, i) + (channel(b, i) - channel(a, i)) * t)
        .toString(16)
        .padStart(2, '0')
    )
    .join('')

export function moodWater(mood: number): WaterColors {
  const clamped = Math.max(0, Math.min(100, mood))
  const [from, to, t] =
    clamped <= 50 ? [PALETTES.low, PALETTES.mid, clamped / 50] : [PALETTES.mid, PALETTES.high, (clamped - 50) / 50]
  return { deep: mixHex(from[0], to[0], t), mid: mixHex(from[1], to[1], t), light: mixHex(from[2], to[2], t) }
}

const TRACK = `linear-gradient(90deg, ${PALETTES.low[0]}, ${PALETTES.mid[0]} 50%, ${PALETTES.high[0]})`

export function MoodResonance({ children, className }: { children: ReactNode; className?: string }) {
  const t = useTranslations('pages.Landing.Platform.visual')
  const [mood, setMood] = useState(55)
  const [source, setSource] = useState({ x: 0.72, y: 0.5 })
  const water = useRef<WaterSurfaceHandle>(null)
  const layer = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const lastDrop = useRef(0)
  const colors = useMemo(() => moodWater(mood), [mood])

  useEffect(() => {
    const locate = () => {
      const area = layer.current?.getBoundingClientRect()
      const box = card.current?.getBoundingClientRect()
      if (!area || !box || !area.width || !area.height) return
      setSource({
        x: (box.left + box.width / 2 - area.left) / area.width,
        y: (box.top + box.height / 2 - area.top) / area.height,
      })
    }
    locate()
    window.addEventListener('resize', locate)
    return () => window.removeEventListener('resize', locate)
  }, [])

  const onMood = (value: number) => {
    setMood(value)
    const now = Date.now()
    if (now - lastDrop.current < 450) return
    lastDrop.current = now
    water.current?.drop(source.x, source.y, 0.95)
  }

  const onPress = (event: PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('a, button, input, label')) return
    const area = layer.current?.getBoundingClientRect()
    if (!area) return
    water.current?.drop((event.clientX - area.left) / area.width, (event.clientY - area.top) / area.height, 0.9)
  }

  return (
    <>
      <div ref={layer} className="pointer-events-none absolute inset-0">
        <WaterSurface ref={water} colors={colors} source={source} every={5} className="h-full w-full" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.18)_45%,rgba(255,255,255,0)_70%)]" />
      </div>
      <div className={className} onPointerDown={onPress}>
        {children}
        <div ref={card} className="relative mx-auto w-full max-w-[500px]">
          <div className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white/70 p-5 shadow-[0_30px_80px_-20px_rgba(70,60,130,0.35)] backdrop-blur-xl tablet:p-7">
            <GlassMedallion glyph="heart" tone="rose" size={46} />
            <h2 className="mt-5 text-[1.45rem] font-semibold leading-tight tracking-tight text-[#302a4f] tablet:text-[1.65rem]">
              {t('title')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6b6480]">{t('subtitle')}</p>

            <div className="mt-6 rounded-[22px] border border-white/80 bg-white/60 p-4">
              <label htmlFor="dzvin-mood" className="mb-3 block text-sm font-semibold text-[#4a3f63]">
                {t('checkin')}
              </label>
              <div className="flex items-center gap-3">
                <GlassMedallion glyph="rain" tone="sky" size={34} />
                <input
                  id="dzvin-mood"
                  type="range"
                  min={0}
                  max={100}
                  value={mood}
                  onChange={(event) => onMood(Number(event.target.value))}
                  aria-valuetext={mood < 34 ? t('moodLow') : mood > 66 ? t('moodHigh') : t('moodMid')}
                  className="dzvin-mood-range h-11 flex-1 cursor-pointer"
                  style={{ '--track': TRACK, '--r2': colors.deep } as CSSProperties}
                />
                <GlassMedallion glyph="sun" tone="sun" size={34} />
              </div>
              <div className="mt-1 flex justify-between px-1 text-xs text-[#6b6480]">
                <span>{t('moodLow')}</span>
                <span>{t('moodHigh')}</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-[20px] border border-white/80 bg-white/60 p-3.5">
                <GlassMedallion glyph="journal" tone="lilac" size={36} />
                <p className="text-sm font-semibold text-[#4a3f63]">{t('journal')}</p>
              </div>
              <div className="flex items-center gap-3 rounded-[20px] border border-white/80 bg-white/60 p-3.5">
                <GlassMedallion glyph="breath" tone="mint" size={36} />
                <p className="text-sm font-semibold text-[#3f5f58]">{t('practice')}</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-[#7d7690]">{t('moodHint')}</p>
          </div>
        </div>
      </div>
    </>
  )
}
