import { render, screen } from '@testing-library/react'
import { getLocale, getTranslations } from 'next-intl/server'

import { DailyStatistics } from '@/components/features/Statistics/DailyStatistics/DailyStatistics'
import { MoodRecordEntity } from '@/types/api-responses'

jest.mock('next-intl/server')

jest.mock('@/components/shared/Cards/Card', () => ({
  __esModule: true,
  default: ({ children, title, subtitle }: { children?: React.ReactNode; title?: string; subtitle?: string }) => (
    <div>
      {title && <h3>{title}</h3>}
      {subtitle && <h4>{subtitle}</h4>}
      {children}
    </div>
  ),
}))

const mockRecord = (overrides?: Partial<MoodRecordEntity>): MoodRecordEntity => ({
  id: '1',
  moodLevel: 4,
  stressLevel: 2,
  energyLevel: 3,
  focusLevel: 4,
  tags: [],
  createdAt: '2026-03-14T10:00:00.000Z',
  ...overrides,
})

beforeEach(() => {
  ;(getLocale as jest.Mock).mockResolvedValue('en')
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string, params?: Record<string, unknown>) => {
    if (params) return `${key}:${JSON.stringify(params)}`
    return key
  })
})

describe('DailyStatistics', () => {
  it('renders with no records showing zero stats', async () => {
    render(await DailyStatistics({ records: [] }))

    expect(screen.getByText('statistics.recordsForDay')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('renders correct record count', async () => {
    render(await DailyStatistics({ records: [mockRecord(), mockRecord({ id: '2' })] }))

    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders mood subtitle for each record', async () => {
    render(await DailyStatistics({ records: [mockRecord()] }))

    // subtitle contains commonGeneral('mood') which returns 'mood'
    const moodElements = screen.getAllByText(/mood/i)
    expect(moodElements.length).toBeGreaterThanOrEqual(1)
  })
})
