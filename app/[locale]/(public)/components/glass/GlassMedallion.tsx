import type { CSSProperties } from 'react'

import { Glyph, type GlyphName } from './glyphs'

export type GlassTone = 'mint' | 'sky' | 'lilac' | 'peach' | 'rose' | 'sun'

/** [highlight, body, deep] — light falls from the top-left. */
const TONES: Record<GlassTone, [string, string, string]> = {
  mint: ['#f2fffb', '#7fdcc4', '#2f9f8c'],
  sky: ['#f3f9ff', '#8cc2f2', '#3f74c9'],
  lilac: ['#fbf6ff', '#b99bf0', '#6a4fc4'],
  peach: ['#fff8f2', '#f7b49a', '#d0675c'],
  rose: ['#fff5f9', '#f1a3c4', '#b8508a'],
  sun: ['#fffbef', '#f8cf7f', '#d38a2c'],
}

type Props = {
  glyph: GlyphName
  tone: GlassTone
  /** Rendered size in px. */
  size?: number
  className?: string
  style?: CSSProperties
}

/**
 * A soft glass pebble with an embossed glyph: radial body, inner highlight,
 * a lower inner shadow and a tinted drop shadow, so icons read as objects
 * rather than outline strokes.
 */
export function GlassMedallion({ glyph, tone, size = 48, className, style }: Props) {
  const [hi, body, deep] = TONES[tone]
  const radius = Math.round(size * 0.32)
  return (
    <span
      aria-hidden="true"
      className={`${className?.includes('absolute') ? '' : 'relative'}inline-flex shrink-0 items-center justify-center ${className ?? ''}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `radial-gradient(120% 120% at 28% 18%, ${hi} 0%, ${body} 46%, ${deep} 100%)`,
        boxShadow: `inset 0 ${Math.max(1, size * 0.03)}px ${Math.max(1, size * 0.04)}px rgba(255,255,255,0.85), inset 0 -${size * 0.14}px ${size * 0.26}px ${deep}55, 0 ${size * 0.2}px ${size * 0.42}px -${size * 0.12}px ${deep}66`,
        ...style,
      }}
    >
      <span
        className="pointer-events-none absolute"
        style={{
          left: '12%',
          top: '7%',
          width: '62%',
          height: '36%',
          borderRadius: '50%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0))',
          filter: `blur(${Math.max(0.5, size * 0.01)}px)`,
        }}
      />
      <Glyph
        name={glyph}
        className="relative"
        style={{
          width: size * 0.54,
          height: size * 0.54,
          filter: `drop-shadow(0 ${Math.max(1, size * 0.025)}px ${Math.max(1, size * 0.03)}px ${deep}aa)`,
        }}
      />
    </span>
  )
}
