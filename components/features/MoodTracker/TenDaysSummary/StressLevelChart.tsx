import { getTranslations } from 'next-intl/server'

import { STRESSES } from '@/constants/stress'
import { DaySummary } from '@/types/daySummary'

type Props = { summaries?: DaySummary[]; locale?: string }

export async function StressLevelChart({ summaries, locale }: Props) {
  const t = await getTranslations('components.StressLevel')

  const map: Record<string, number> = {}
  if (Array.isArray(summaries)) {
    for (const s of summaries) {
      if (s?.date && s.stress !== undefined) map[s.date] = s.stress
    }
  }

  const today = new Date()
  const dates = Array.from({ length: 10 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (9 - i))
    return d
  })

  const data = dates.map((d) => {
    const iso = d.toISOString().slice(0, 10)
    return { date: iso, stress: map[iso as string] ?? null }
  })

  const width = 600
  const height = 250
  const padding = { left: 32, right: 16, top: 16, bottom: 32 }
  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom

  const points = data
    .map((d, i) => {
      if (d.stress === null) return null
      const x = padding.left + (innerW * i) / Math.max(1, data.length - 1)
      const v = Number(d.stress)
      const clamped = Math.max(1, Math.min(5, v))
      const y = padding.top + ((5 - clamped) / 4) * innerH
      return { ...d, stress: d.stress as number, x, y, value: clamped }
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)

  function catmullRomToBezier(ps: { x: number; y: number; value?: number }[]) {
    if (!ps || ps.length === 0) return ''
    if (ps.length === 1) return `M ${ps[0].x.toFixed(2)} ${ps[0].y.toFixed(2)}`
    let d = `M ${ps[0].x.toFixed(2)} ${ps[0].y.toFixed(2)}`
    for (let i = 0; i < ps.length - 1; i++) {
      const p0 = i === 0 ? ps[0] : ps[i - 1]
      const p1 = ps[i as number]
      const p2 = ps[i + 1]
      const p3 = i + 2 < ps.length ? ps[i + 2] : p2

      // If adjacent points have the same value, draw a straight line between them (no smoothing)
      if (p1.value !== undefined && p2.value !== undefined && p1.value === p2.value) {
        d += ` L ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
        continue
      }

      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6

      d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)} ${cp2x.toFixed(2)} ${cp2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
    }
    return d
  }

  const pathD = catmullRomToBezier(points.map((p) => ({ x: p.x, y: p.y, value: p.value })))

  return (
    <div className="p-2">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="140" role="img" aria-label={t('title')}>
        {Array.from({ length: 5 }).map((_, idx) => {
          const y = padding.top + (idx / 4) * innerH
          return (
            <line
              key={`grid-${idx}`}
              x1={padding.left}
              x2={width - padding.right}
              y1={y}
              y2={y}
              stroke="var(--border)"
              strokeOpacity={0.12}
            />
          )
        })}

        {/* show three labels on Y axis: low, medium, high */}
        {(() => {
          const keys: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high']
          return keys.map((key) => {
            const idx = STRESSES.findIndex((s) => s.key === key)
            const value = idx >= 0 ? idx + 1 : key === 'low' ? 2 : key === 'medium' ? 3 : 4
            const y = padding.top + ((5 - value) / 4) * innerH
            const displayKey = key === 'medium' ? 'average' : key
            return (
              <text key={`y-${key}`} x={0} y={y + 8} fontSize={20} fill="hsl(var(--text-primary))" textAnchor="start">
                {t('stressLevel', { stressLevel: displayKey })}
              </text>
            )
          })
        })()}

        <path d={pathD} fill="none" stroke={`url(#strokeGradient)`} strokeWidth={4} strokeLinecap="round" />
        <path
          d={`${pathD} L ${width - padding.right} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`}
          fill={`url(#fillGradient)`}
          fillOpacity={0.12}
        />

        <defs>
          <linearGradient id="strokeGradient" x1="0" y1="0" x2="0" y2="1">
            {STRESSES.slice()
              .reverse()
              .map((s, idx, arr) => (
                <stop
                  key={s.key}
                  offset={`${(idx / Math.max(1, arr.length - 1)) * 100}%`}
                  stopColor={s.color}
                  stopOpacity={1}
                />
              ))}
          </linearGradient>
          <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
            {STRESSES.slice()
              .reverse()
              .map((s, idx, arr) => (
                <stop
                  key={s.key}
                  offset={`${(idx / Math.max(1, arr.length - 1)) * 100}%`}
                  stopColor={s.color}
                  stopOpacity={idx === arr.length - 1 ? 0.12 : 0.06}
                />
              ))}
          </linearGradient>
        </defs>

        {points.map((p) => (
          <rect
            key={p.date}
            x={p.x - 3}
            y={p.y - 3}
            width={6}
            height={6}
            rx={1}
            ry={1}
            fill={STRESSES[p.value - 1]?.color ?? STRESSES[STRESSES.length - 1]?.color}
          />
        ))}

        {points.map((p) => (
          <text
            key={`x-${p.date}`}
            x={p.x}
            y={height - 6}
            textAnchor="middle"
            fontSize={20}
            className="text-muted-foreground"
          >
            {new Date(p.date).toLocaleDateString(locale || undefined, { weekday: 'short' })}
          </text>
        ))}
      </svg>
    </div>
  )
}
