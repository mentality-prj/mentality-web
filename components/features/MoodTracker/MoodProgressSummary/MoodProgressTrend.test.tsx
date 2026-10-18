import { render, screen } from '@testing-library/react'

import { MoodProgressTrend } from './MoodProgressTrend'

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  LineChart: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  CartesianGrid: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  Line: () => null,
}))

const trend = [{ date: '2026-03-30', mood: 3, stress: 4 }]

describe('MoodProgressTrend accessible calendar dates', () => {
  it('announces the source IANA time zone instead of incorrectly calling local dates UTC', () => {
    render(
      <MoodProgressTrend
        trend={trend}
        moodLabel="Настрій"
        stressLabel="Стрес"
        chartAccessible="Динаміка"
        dateLabel="Дата"
        timeZone="Europe/Warsaw"
      />
    )
    expect(screen.getByRole('columnheader', { name: 'Дата (Europe/Warsaw)' })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: '2026-03-30' })).toBeInTheDocument()
  })

  it('explicitly identifies the UTC fallback when user zone is not available', () => {
    render(
      <MoodProgressTrend trend={trend} moodLabel="Mood" stressLabel="Stress" chartAccessible="Chart" dateLabel="Date" />
    )
    expect(screen.getByRole('columnheader', { name: 'Date (UTC)' })).toBeInTheDocument()
  })
})
