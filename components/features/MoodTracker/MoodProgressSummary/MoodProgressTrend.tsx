'use client'

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { MoodProgressData } from '@/helpers/moodProgress'

type Props = {
  trend: MoodProgressData['trend']
  moodLabel: string
  stressLabel: string
  chartAccessible: string
}

/** 30-day recorded daily averages; missing check-ins are genuine gaps. */
export function MoodProgressTrend({ trend, moodLabel, stressLabel, chartAccessible }: Props) {
  const data = trend.map((item) => ({ ...item, day: item.date.slice(5) }))
  const observations = trend.filter((item) => item.mood !== null && item.stress !== null)

  return (
    <>
      <div className="h-56 w-full" role="img" aria-label={chartAccessible}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -24, bottom: 4 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="day" minTickGap={25} tickLine={false} axisLine={false} />
            <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tickLine={false} axisLine={false} />
            <Tooltip />
            <Line
              dataKey="mood"
              name={moodLabel}
              type="linear"
              stroke="var(--color-mood, #905fff)"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
            <Line
              dataKey="stress"
              name={stressLabel}
              type="linear"
              stroke="var(--color-stress, #b91c1c)"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-textcolor-secondary">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary" />
          {moodLabel}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-600" />
          {stressLabel}
        </span>
      </div>
      <table className="sr-only">
        <caption>{chartAccessible}</caption>
        <thead>
          <tr>
            <th scope="col">Date (UTC)</th>
            <th scope="col">{moodLabel}</th>
            <th scope="col">{stressLabel}</th>
          </tr>
        </thead>
        <tbody>
          {observations.map((item) => (
            <tr key={item.date}>
              <th scope="row">{item.date}</th>
              <td>{item.mood}</td>
              <td>{item.stress}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
