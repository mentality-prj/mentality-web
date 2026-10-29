import { type CSSProperties, type ReactNode, useId } from 'react'

/**
 * Dzvin's hand-drawn line icons: a thin, slightly uneven ink line on a soft
 * pastel disc. Original drawings on a 120px grid; the "hand" filter adds a
 * gentle wobble so lines read as drawn rather than constructed.
 */
export type DoodleName =
  | 'mood'
  | 'journal'
  | 'breath'
  | 'wind'
  | 'heart'
  | 'rise'
  | 'people'
  | 'flask'
  | 'shield'
  | 'chart'
  | 'briefcase'
  | 'report'
  | 'rain'
  | 'sun'
  | 'bell'
  | 'building'

export type DoodleTone = 'mint' | 'lilac' | 'peach' | 'sky' | 'rose' | 'sand' | 'paper'

export const DOODLE_TONES: Record<DoodleTone, string> = {
  mint: '#e2f1ee',
  lilac: '#ede5f7',
  peach: '#f7e7dc',
  sky: '#e2ecf8',
  rose: '#f7e4ec',
  sand: '#f2ebdb',
  /** For icons on already-tinted cards. */
  paper: '#fffdfb',
}

const DOODLES: Record<DoodleName, ReactNode> = {
  mood: (
    <>
      <circle cx="50" cy="44" r="13" />
      <path d="M50 22v-6M31 31l-4-4M69 31l4-4M28 46h-6" />
      <path d="M44 66h42a11 11 0 0 0-2-22 15 15 0 0 0-28 4 9 9 0 0 0-12 18Z" fill="var(--doodle-bg)" />
      <path d="M24 88h72" />
      <path d="M24 92h72" opacity=".35" />
      <circle cx="62" cy="90" r="6" fill="#fff" />
      <path d="M30 100l2 3 3-4M84 100l1 3M88 99l-1 4" />
    </>
  ),
  journal: (
    <>
      <path d="M20 34c12-5 26-4 40 4v60c-14-8-28-9-40-4V34Z" />
      <path d="M100 34c-12-5-26-4-40 4v60c14-8 28-9 40-4V34Z" />
      <path d="M28 48c8-2 16-1 24 3M28 58c8-2 16-1 24 3M28 68c8-2 16-1 20 2" />
      <path d="M70 60c3-6 11-6 12 0 2-6 10-6 11 0-1 7-7 11-11.5 14C77 71 71 67 70 60Z" />
      <path d="M86 20l12-12 6 6-12 12-8 2 2-8Z" />
      <path d="M68 84l2 2M76 86l1 2M84 84l2 1" />
    </>
  ),
  breath: (
    <>
      <path d="M30 104c0-10-4-16-9-23-9-11-11-26-6-39 6-17 23-26 40-24 17 2 28 15 29 31l1 5c0 3 4 8 6 12 1 3-1 4-3 4 1 4 0 6-2 7 1 2 0 4-2 5 0 5-2 8-8 9l-6 1c-1 5-1 9 0 13" />
      <path d="M60 44c2 2 5 2 7 0" />
      <path d="M96 62c6 0 8-3 13-3M96 68c8 0 10 5 17 5" />
      <ellipse cx="102" cy="96" rx="12" ry="4" />
      <ellipse cx="102" cy="96" rx="5" ry="1.6" />
      <path d="M102 82v4" />
      <path d="M34 60c-3-7 0-14 6-17 6 3 8 10 5 17M34 60c-7-1-11-6-12-12 7-1 12 3 14 7M45 60c7-1 11-6 12-12-7-1-12 3-14 7" />
    </>
  ),
  wind: (
    <>
      <path d="M18 46h48a12 12 0 1 0-12-12" />
      <path d="M18 62h66a14 14 0 1 1-14 14" />
      <path d="M18 78h28" />
      <path d="M86 40c4-2 8-2 12 0M92 52c3-1 6-1 9 0" opacity=".6" />
      <circle cx="34" cy="94" r="2" />
      <circle cx="98" cy="96" r="2.5" />
    </>
  ),
  heart: (
    <>
      <path d="M60 96C38 82 24 68 24 50c0-11 8-19 18-19 8 0 14 4 18 11 4-7 10-11 18-11 10 0 18 8 18 19 0 18-14 32-36 46Z" />
      <path d="M38 50c0-5 3-8 7-9" />
      <path d="M96 22v10M91 27h10M24 88v6M21 91h6" />
      <circle cx="102" cy="74" r="2" />
    </>
  ),
  rise: (
    <>
      <path d="M18 98h86" />
      <path d="M26 98V78h14v20M52 98V64h14v34M78 98V48h14v50" />
      <path d="M85 48c0-8 0-14-1-20" />
      <path d="M84 34c-8-2-12-8-12-14 8 0 12 6 12 14ZM85 30c6-4 12-4 16-1-3 6-10 7-16 1Z" />
      <path d="M30 70l2 3M58 56l2 3" opacity=".6" />
      <circle cx="104" cy="24" r="2" />
    </>
  ),
  people: (
    <>
      <circle cx="44" cy="40" r="12" />
      <path d="M20 94c0-16 10-28 24-28s24 12 24 28" />
      <circle cx="80" cy="46" r="10" />
      <path d="M70 70c3-2 6-3 10-3 12 0 20 10 20 25" />
      <path d="M38 40h1M48 40h1M40 46c2 2 6 2 8 0" />
      <path d="M96 22l2 4 4 1-4 2-1 4-2-4-4-1 4-2Z" />
    </>
  ),
  flask: (
    <>
      <path d="M48 18h24M52 18v28L28 88c-3 6 1 12 8 12h48c7 0 11-6 8-12L68 46V18" />
      <path d="M38 74c8-4 14 4 22 0s14-4 22 0" />
      <circle cx="54" cy="86" r="3" />
      <circle cx="66" cy="82" r="2" />
      <circle cx="60" cy="62" r="2" />
      <path d="M86 26c4 0 6 2 6 6M92 18c6 1 10 5 11 11" opacity=".6" />
    </>
  ),
  shield: (
    <>
      <path d="M60 16l34 12v26c0 22-14 40-34 48-20-8-34-26-34-48V28l34-12Z" />
      <path d="M44 58l11 11 22-24" />
      <path d="M36 34c3-1 6-2 8-3" opacity=".6" />
    </>
  ),
  chart: (
    <>
      <path d="M20 20v80h82" />
      <path d="M34 86V64M50 86V52M66 86V58M82 86V38" />
      <path d="M30 50l18-14 16 8 24-20" />
      <path d="M80 24h8v8" />
      <circle cx="48" cy="36" r="2" />
    </>
  ),
  briefcase: (
    <>
      <path d="M46 36v-8c0-4 3-7 7-7h14c4 0 7 3 7 7v8" />
      <path d="M20 44c0-5 3-8 8-8h64c5 0 8 3 8 8v42c0 5-3 8-8 8H28c-5 0-8-3-8-8V44Z" />
      <path d="M20 60c24 8 56 8 80 0" />
      <path d="M54 62h12v8H54z" />
    </>
  ),
  report: (
    <>
      <path d="M30 16h40l20 20v62c0 3-2 6-6 6H30c-4 0-6-3-6-6V22c0-3 2-6 6-6Z" />
      <path d="M70 16v20h20" />
      <path d="M36 50h40M36 62h40M36 74h28" />
      <path d="M40 88l6-6 6 4 10-10" />
    </>
  ),
  rain: (
    <>
      <path d="M34 66h50a14 14 0 0 0-2-28 20 20 0 0 0-38 4 12 12 0 0 0-10 24Z" />
      <path d="M40 80l-4 10M58 80l-4 10M76 80l-4 10" />
      <path d="M48 96l-2 5M66 96l-2 5" opacity=".6" />
    </>
  ),
  sun: (
    <>
      <circle cx="60" cy="60" r="18" />
      <path d="M60 22v12M60 86v12M22 60h12M86 60h12M33 33l8 8M79 79l8 8M33 87l8-8M79 41l8-8" />
      <path d="M52 56h.5M67 56h.5M53 66c4 3 10 3 14 0" />
    </>
  ),
  bell: (
    <>
      <path d="M60 18v8" />
      <path d="M38 82V58c0-13 9-24 22-24s22 11 22 24v24l8 8H30l8-8Z" />
      <path d="M52 98c2 4 5 6 8 6s6-2 8-6" />
      <path d="M22 50c-4 6-4 14 0 20M98 50c4 6 4 14 0 20M14 44c-7 10-7 22 0 32M106 44c7 10 7 22 0 32" opacity=".7" />
    </>
  ),
  building: (
    <>
      <path d="M26 100V24c0-3 2-5 5-5h34c3 0 5 2 5 5v76M70 50h20c3 0 5 2 5 5v45M18 100h86" />
      <path d="M38 34h8M52 34h6M38 48h8M52 48h6M38 62h8M52 62h6M80 64h6M80 78h6" />
      <path d="M42 100V80h14v20" />
    </>
  ),
}

type Props = {
  name: DoodleName
  tone?: DoodleTone
  /** Outer size in px. */
  size?: number
  /** Draw the line only, without the pastel disc (for large decorative use). */
  plain?: boolean
  className?: string
  style?: CSSProperties
}

export function DoodleIcon({ name, tone = 'lilac', size = 72, plain = false, className, style }: Props) {
  const filterId = `dz-hand-${useId().replace(/:/g, '')}`
  const background = DOODLE_TONES[tone]
  // Keep the ink line ~1.6–2.2px on screen whatever the icon size.
  const drawn = plain ? size : size * 0.66
  const linePx = size >= 120 ? 2.2 : size >= 56 ? 1.9 : 1.6
  const stroke = (linePx * 120) / drawn
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${className ?? ''}`}
      style={{ width: size, height: size, background: plain ? 'transparent' : background, ...style }}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        stroke="#2b2733"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: plain ? '100%' : '66%', height: plain ? '100%' : '66%', ['--doodle-bg' as string]: background }}
      >
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="1" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="1.6" />
        </filter>
        <g filter={`url(#${filterId})`}>{DOODLES[name]}</g>
      </svg>
    </span>
  )
}
