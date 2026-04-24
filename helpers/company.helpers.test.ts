import { buildAnalyticsTrendChartData, formatAnalyticsPeriodLabel } from '@/helpers/company.helpers'
import { AnalyticsTrendPoint } from '@/types/company'

describe('formatAnalyticsPeriodLabel', () => {
  it('formats a period range as dd.mm.yyyy – dd.mm.yyyy', () => {
    expect(formatAnalyticsPeriodLabel('2026-04-09/2026-04-22')).toBe('09.04.2026 – 22.04.2026')
  })

  it('returns the original value for invalid periods', () => {
    expect(formatAnalyticsPeriodLabel('2026-04')).toBe('2026-04')
  })
})

describe('buildAnalyticsTrendChartData', () => {
  it('inserts null-valued gap points for missing periods', () => {
    const trend: AnalyticsTrendPoint[] = [
      {
        period: '2026-04-09/2026-04-22',
        avgMood: 3.4,
        avgStress: 2.2,
        avgEnergy: 3.1,
        avgFocus: 3,
        checkins: 10,
      },
      {
        period: '2026-05-07/2026-05-20',
        avgMood: 3.6,
        avgStress: 2.1,
        avgEnergy: 3.3,
        avgFocus: 3.2,
        checkins: 12,
      },
    ]

    const chartData = buildAnalyticsTrendChartData(trend)

    expect(chartData).toHaveLength(3)
    expect(chartData[1]).toMatchObject({
      period: '2026-04-23/2026-05-06',
      periodLabel: '23.04.2026 – 06.05.2026',
      avgMood: null,
      avgStress: null,
      avgEnergy: null,
      avgFocus: null,
      checkins: null,
      isGap: true,
    })
  })

  it('does not insert extra points when periods are contiguous', () => {
    const trend: AnalyticsTrendPoint[] = [
      {
        period: '2026-04-09/2026-04-22',
        avgMood: 3.4,
        avgStress: 2.2,
        avgEnergy: 3.1,
        avgFocus: 3,
        checkins: 10,
      },
      {
        period: '2026-04-23/2026-05-06',
        avgMood: 3.6,
        avgStress: 2.1,
        avgEnergy: 3.3,
        avgFocus: 3.2,
        checkins: 12,
      },
    ]

    const chartData = buildAnalyticsTrendChartData(trend)

    expect(chartData).toHaveLength(2)
    expect(chartData.every((point) => point.isGap === false)).toBe(true)
  })
})
