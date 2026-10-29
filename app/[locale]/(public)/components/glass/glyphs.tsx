import type { CSSProperties, ReactNode } from 'react'

/**
 * Dzvin's own filled glyphs, drawn on a 24px grid to sit embossed on glass
 * medallions (white on tinted glass). Solid shapes, not outline strokes.
 */
export type GlyphName =
  | 'heart'
  | 'pulse'
  | 'journal'
  | 'breath'
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

const stroke = {
  fill: 'none',
  stroke: '#fff',
  strokeWidth: 2.3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

const GLYPHS: Record<GlyphName, ReactNode> = {
  heart: (
    <path d="M12 20.4c-.3 0-.6-.1-.8-.3C7.3 16.9 4 13.9 4 10.1 4 7.5 6 5.4 8.5 5.4c1.4 0 2.7.7 3.5 1.8.8-1.1 2.1-1.8 3.5-1.8 2.5 0 4.5 2.1 4.5 4.7 0 3.8-3.3 6.8-7.2 10-.2.2-.5.3-.8.3Z" />
  ),
  pulse: (
    <>
      <circle cx="12" cy="12" r="9" opacity=".32" />
      <path {...stroke} d="M4.5 12.4h3.2l1.9-4.2 3.6 8.4 2-4.2h4.3" />
    </>
  ),
  journal: (
    <>
      <path d="M3.4 6.1c2.9-1 5.7-.7 7.8.9v12.6c-2.1-1.5-4.9-1.8-7.8-.8V6.1Z" opacity=".78" />
      <path d="M20.6 6.1c-2.9-1-5.7-.7-7.8.9v12.6c2.1-1.5 4.9-1.8 7.8-.8V6.1Z" />
    </>
  ),
  breath: (
    <>
      <path {...stroke} d="M3.5 9.2h9.8a2.6 2.6 0 1 0-2.6-2.6" />
      <path {...stroke} d="M3.5 13.2h13.6a2.9 2.9 0 1 1-2.9 2.9" />
      <path {...stroke} opacity=".7" d="M3.5 17.2h5" />
    </>
  ),
  rise: (
    <>
      <rect x="3.6" y="13" width="4.4" height="7.4" rx="1.8" opacity=".6" />
      <rect x="9.8" y="9.4" width="4.4" height="11" rx="1.8" opacity=".8" />
      <rect x="16" y="5.6" width="4.4" height="14.8" rx="1.8" />
    </>
  ),
  people: (
    <>
      <circle cx="16.6" cy="8.6" r="2.7" opacity=".7" />
      <path d="M14.6 14.1c.6-.2 1.2-.3 1.9-.3 2.8 0 4.6 1.9 4.6 4.6v1.1h-4.6c0-2.2-.7-4-1.9-5.4Z" opacity=".7" />
      <circle cx="9" cy="7.8" r="3.3" />
      <path d="M2.9 19.1c0-3.4 2.7-5.7 6.1-5.7s6.1 2.3 6.1 5.7v.4H2.9v-.4Z" />
    </>
  ),
  flask: (
    <>
      <path
        opacity=".5"
        d="M9.5 3h5a.8.8 0 0 1 0 1.6H14v4l5.1 8.8a2.2 2.2 0 0 1-1.9 3.3H6.8a2.2 2.2 0 0 1-1.9-3.3L10 8.6v-4h-.5a.8.8 0 0 1 0-1.6Z"
      />
      <path d="M7.4 14.6h9.2l1.5 2.6a1.3 1.3 0 0 1-1.1 2H7a1.3 1.3 0 0 1-1.1-2l1.5-2.6Z" />
      <circle cx="11" cy="11.6" r="1" />
      <circle cx="13.3" cy="9.7" r=".7" opacity=".8" />
    </>
  ),
  shield: (
    <path
      fillRule="evenodd"
      d="M12 2.8 19.2 5.5v5.6c0 4.5-3 8.3-7.2 9.9-4.2-1.6-7.2-5.4-7.2-9.9V5.5L12 2.8Zm3.3 6.6a1 1 0 0 0-1.4.1L11 12.9l-1.4-1.3a1 1 0 1 0-1.4 1.5l2.2 2a1 1 0 0 0 1.5-.1l3.6-4.2a1 1 0 0 0-.2-1.4Z"
    />
  ),
  chart: (
    <>
      <path d="M3.5 19.6 8.2 13l3.6 2.8 5-7.1 3.7 3.6v7.3H3.5Z" opacity=".8" />
      <circle cx="8.2" cy="13" r="1.6" />
      <circle cx="11.8" cy="15.8" r="1.6" />
      <circle cx="16.8" cy="8.7" r="1.6" />
    </>
  ),
  briefcase: (
    <>
      <path {...stroke} d="M9 7.4V6.1A2 2 0 0 1 11 4.1h2a2 2 0 0 1 2 2v1.3" />
      <rect x="3" y="7.4" width="18" height="12.4" rx="3.2" />
    </>
  ),
  report: (
    <path
      fillRule="evenodd"
      d="M8 2.8h8a3 3 0 0 1 3 3v12.4a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V5.8a3 3 0 0 1 3-3Zm1.2 5a.8.8 0 0 0 0 1.6h5.6a.8.8 0 0 0 0-1.6H9.2Zm0 3.8a.8.8 0 0 0 0 1.6h5.6a.8.8 0 0 0 0-1.6H9.2Zm0 3.8a.8.8 0 0 0 0 1.6h3.4a.8.8 0 0 0 0-1.6H9.2Z"
    />
  ),
  rain: (
    <>
      <path d="M7.4 14.6a4 4 0 0 1-.5-8 5.6 5.6 0 0 1 10.6 1.6 3.3 3.3 0 0 1-.3 6.4H7.4Z" />
      <path {...stroke} opacity=".75" d="M8.4 17.4 7.6 19.6M12.2 17.4l-.8 2.2M16 17.4l-.8 2.2" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.4" />
      <path
        {...stroke}
        opacity=".8"
        d="M12 2.9v1.8M12 19.3v1.8M2.9 12h1.8M19.3 12h1.8M5.6 5.6l1.3 1.3M17.1 17.1l1.3 1.3M5.6 18.4l1.3-1.3M17.1 6.9l1.3-1.3"
      />
    </>
  ),
  bell: (
    <>
      <path d="M12 2.6a1.4 1.4 0 0 1 1.4 1.4v.6a6.1 6.1 0 0 1 4.7 5.9v3.8l1.5 2.6a1 1 0 0 1-.9 1.5H5.3a1 1 0 0 1-.9-1.5l1.5-2.6v-3.8a6.1 6.1 0 0 1 4.7-5.9V4A1.4 1.4 0 0 1 12 2.6Z" />
      <circle cx="12" cy="20.4" r="1.9" opacity=".8" />
    </>
  ),
  building: (
    <path
      fillRule="evenodd"
      d="M6.5 3h7a2.5 2.5 0 0 1 2.5 2.5V9h1.5A2.5 2.5 0 0 1 20 11.5V21H4V5.5A2.5 2.5 0 0 1 6.5 3Zm1.5 4v1.8h2V7H8Zm3.5 0v1.8h2V7h-2ZM8 10.6v1.8h2v-1.8H8Zm3.5 0v1.8h2v-1.8h-2ZM8 14.2V16h2v-1.8H8Zm3.5 0V16h2v-1.8h-2Zm5 0V16h1.5v-1.8h-1.5Zm-5.5 3.6V21h2v-3.2h-2Z"
    />
  ),
}

export function Glyph({ name, className, style }: { name: GlyphName; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true" className={className} style={style}>
      {GLYPHS[name]}
    </svg>
  )
}
