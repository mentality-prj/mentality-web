'use client'

import { type CSSProperties, type ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

import { DoodleIcon } from './doodle/DoodleIcon'
import { type WaterColors, WaterSurface, type WaterSurfaceHandle } from './water/WaterSurface'

/**
 * "Resonance" â€” Dzvin means a bell. The hero keeps the original hero-zen water
 * (rings from the logo); one ripple starts at the logo on page load, while
 * the mood slider only changes its tint. Nothing is stored: this is a local, decorative demo.
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

/** Ripple tint mat¶»§q«^