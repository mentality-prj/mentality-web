/**
 * Abstract landing illustrations in the "resonance" motif: soft concentric
 * waves in the site palette. Purely decorative — no people, no dashboards.
 */
type IllustrationProps = { className?: string }

const frame = 'h-full w-full'

/** A page that writes itself into calm ripples — the personal journal. */
export function JournalIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 400 300" className={className ?? frame} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="dz-journal-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0fbf7" />
          <stop offset="1" stopColor="#e6eefe" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#dz-journal-bg)" />
      {[50, 90, 130, 170, 210].map((r, i) => (
        <circle
          key={r}
          cx="290"
          cy="220"
          r={r}
          fill="none"
          stroke="#8fe8d7"
          strokeOpacity={0.55 - i * 0.09}
          strokeWidth="1.5"
        />
      ))}
      <g transform="rotate(-6 170 150)">
        <rect x="92" y="62" width="168" height="196" rx="20" fill="#fff" stroke="#d9d0f2" />
        {[102, 126, 150, 174].map((y, i) => (
          <rect key={y} x="118" y={y} width={i === 3 ? 70 : 116} height="7" rx="3.5" fill="#e6defa" />
        ))}
        <path
          d="M118 212c14-10 28 10 42 0s28 10 42 0"
          fill="none"
          stroke="#cca7ff"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
      <circle cx="290" cy="220" r="12" fill="#5fc9b4" />
    </svg>
  )
}

/** Breath as expanding rings around a soft core. */
export function BreathIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 400 300" className={className ?? frame} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="dz-breath-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eaf7ff" />
          <stop offset="1" stopColor="#f1ebff" />
        </linearGradient>
        <radialGradient id="dz-breath-core">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#d9f5f1" />
          <stop offset="1" stopColor="#b8e6f0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#dz-breath-bg)" />
      {[150, 125, 100, 78].map((r, i) => (
        <circle
          key={r}
          cx="200"
          cy="150"
          r={r}
          fill="#ffffff"
          fillOpacity={0.18 + i * 0.08}
          stroke="#a9c4f5"
          strokeOpacity={0.35 + i * 0.1}
        />
      ))}
      <circle cx="200" cy="150" r="56" fill="url(#dz-breath-core)" stroke="#8fd3e0" strokeWidth="2" />
      <path d="M176 150c8-7 16 7 24 0s16 7 24 0" fill="none" stroke="#4fa9b8" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/** A gentle rising line of check-ins — noticing what goes well. */
export function HistoryIllustration({ className }: IllustrationProps) {
  const points: [number, number][] = [
    [40, 212],
    [100, 190],
    [160, 202],
    [220, 160],
    [280, 150],
    [340, 108],
  ]
  const line = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')
  return (
    <svg viewBox="0 0 400 300" className={className ?? frame} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="dz-history-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff4ec" />
          <stop offset="1" stopColor="#fbeaf6" />
        </linearGradient>
        <linearGradient id="dz-history-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb9a9" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffb9a9" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#dz-history-bg)" />
      {[40, 70, 100].map((r, i) => (
        <circle
          key={r}
          cx="340"
          cy="70"
          r={r}
          fill="none"
          stroke="#ffcf8a"
          strokeOpacity={0.6 - i * 0.18}
          strokeWidth="1.5"
        />
      ))}
      <circle cx="340" cy="70" r="20" fill="#ffd9a3" />
      <path d={`${line} L340 300 L40 300 Z`} fill="url(#dz-history-area)" />
      <path d={line} fill="none" stroke="#e58fa0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {points.map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="7" fill="#fff" stroke="#e58fa0" strokeWidth="3" />
      ))}
    </svg>
  )
}

/** The bell — Dzvin — with its resonance; used beside "How it works". */
export function BellIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 500 300" className={className ?? frame} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="dz-bell-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff1e8" />
          <stop offset="0.45" stopColor="#f3e9ff" />
          <stop offset="1" stopColor="#e2f7f0" />
        </linearGradient>
        <linearGradient id="dz-bell-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b993f5" />
          <stop offset="1" stopColor="#6f7ce8" />
        </linearGradient>
      </defs>
      <rect width="500" height="300" fill="url(#dz-bell-bg)" />
      {[70, 110, 150, 190, 230, 270].map((r, i) => (
        <circle
          key={r}
          cx="250"
          cy="160"
          r={r}
          fill="none"
          stroke={i % 2 ? '#8fe8d7' : '#cca7ff'}
          strokeOpacity={0.7 - i * 0.1}
          strokeWidth="1.5"
        />
      ))}
      <path
        d="M250 92c-30 0-48 24-50 56l-4 40c-1 9-8 14-16 18h140c-8-4-15-9-16-18l-4-40c-2-32-20-56-50-56Z"
        fill="url(#dz-bell-body)"
      />
      <circle cx="250" cy="86" r="8" fill="#8f7be8" />
      <circle cx="250" cy="218" r="12" fill="#ffb9a9" />
    </svg>
  )
}
