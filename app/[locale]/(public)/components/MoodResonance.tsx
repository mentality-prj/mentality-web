'use client'

import {
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslations } from 'next-intl'

import { DoodleIcon } from './doodle/DoodleIcon'
import { type WaterColors, WaterSurface, type WaterSurfaceHandle } from './water/WaterSurface'

/**
 * "Resonance" — Dzvin means a bell. The hero keeps the original hero-zen water
 * (rings from the logo); on top, the mood slider nudges its hue and sends a
 * ripple from the card, and a tap on the background drops one where you touched. Nothing is stored: this is a local, decorative demo.
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

/** Ripple tint matched to the hero-zen turquoise. */
const HERO_WATER = { deep: '#5fb3c4', mid: '#dff4f7', light: '#ffffff' }

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
  // The water keeps its original turquoise; mood only nudges the hue (cool when heavy, warm when light).
  const tint = mood < 50 ? '#7f9be6' : '#f0a77e'
  const tintStrength = (Math.abs(mood - 50) / 50) * 0.35

  // Anchor the hero-zen rings under the header logo, exactly like the original design.
  useLayoutEffect(() => {
    const hero = layer.current?.parentElement
    const logo = document.querySelector<HTMLElement>('[data-landing-logo="true"]')
    if (!hero || !logo) return
    const INSET = 0.28
    const anchor = () => {
      const heroRect = hero.getBoundingClientRect()
      const logoRect = logo.getBoundingClientRect()
      const pseudoLeft = heroRect.left - heroRect.width * INSET
      const pseudoTop = heroRect.top - heroRect.height * INSET
      hero.style.setProperty('--hero-gradient-x', `${logoRect.left + logoRect.width / 2 - pseudoLeft}px`)
      hero.style.setProperty(
        '--hero-gradient-y',
        `${Math.max(logoRect.top + logoRect.height / 2 - pseudoTop, heroRect.height * 0.18)}px`
      )
      hero.dataset.heroRingsReady = 'true'
    }
    anchor()
    window.addEventListener('resize', anchor)
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(anchor) : null
    observer?.observe(logo)
    return () => {
      window.removeEventListener('resize', anchor)
      observer?.disconnect()
    }
  }, [])

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
      <div
        ref={layer}
        className="pointer-events-none inset-0"
        // .hero-zen > * forces position: relative; the ripple layer must stay absolute.
        style={{ position: 'absolute', zIndex: 1 }}
      >
        <div
          className="absolute inset-0 transition-[background-color,opacity] duration-700"
          style={{ backgroundColor: tint, opacity: tintStrength, mixBlendMode: 'color' }}
        />
        <WaterSurface ref={water} colors={HERO_WATER} source={source} still overlay className="h-full w-full" />
      </div>
      <div className={`relative z-[2] ${className ?? ''}`} onPointerDown={onPress}>
        {children}
        <div ref={card} className="relative mx-auto w-full max-w-[500px]">
          <div className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white/70 p-5 shadow-[0_30px_80px_-20px_rgba(70,60,130,0.35)] backdrop-blur-xl tablet:p-7">
            <DoodleIcon name="heart" tone="rose" size={60} />
            <h2 className="mt-5 text-[1.45rem] font-semibold leading-tight tracking-tight text-[#302a4f] tablet:text-[1.65rem]">
              {t('title')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6b6480]">{t('subtitle')}</p>

            <div className="mt-6 rounded-[22px] border border-white/80 bg-white/60 p-4">
              <label htmlFor="dzvin-mood" className="mb-3 block text-sm font-semibold text-[#4a3f63]">
                {t('checkin')}
              </label>
              <div className="flex items-center gap-3">
                <DoodleIcon name="rain" tone="sky" size={42} />
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
                <DoodleIcon name="sun" tone="sand" size={42} />
              </div>
              <div className="mt-1 flex justify-between px-1 text-xs text-[#6b6480]">
                <span>{t('moodLow')}</span>
                <span>{t('moodHigh')}</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-[20px] border border-white/80 bg-white/60 p-3.5">
                <DoodleIcon name="journal" tone="lilac" size={48} />
                <p className="text-sm font-semibold text-[#4a3f63]">{t('journal')}</p>
              </div>
              <div className="flex items-center gap-3 rounded-[20px] border border-white/80 bg-white/60 p-3.5">
                <DoodleIcon name="wind" tone="mint" size={48} />
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
