import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import { MoodRecordEntity } from '@/types/api-responses'

import { YourActivity } from './YourActivity'

jest.mock('next-intl/server')

jest.mock('@/components/features/MoodTracker/MoodLevelBars/MoodLevelBars', () => ({
  MoodLevelBars: () => <div data-testid="mood-level-bars" />,
}))

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
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string, params?: Record<string, unknown>) => {
    if (params) return `${key}:${JSON.stringify(params)}`
    return key
  })
})

describe('YourActivity', () => {
  it('renders with no records', async () => {
    render(await YourActivity({ records: [] }))

    expect(screen.getByText('statistics.noRecordsToday')).toBeInTheDocument()
  })

  it('renders a MoodLevelBars for each record', async () => {
    render(
      await YourActivity({
        records: [mockRecord({ id: '1' }), mockRecord({ id: '2' })],
      })
    )

    expect(screen.getAllByTestId('mood-level-bars')).toHaveLength(2)
  })

  it('does not render MoodLevelBars when no records', async () => {
    render(await YourActivity({ records: [] }))

    expect(screen.queryByTestId('mood-level-bars')).not.toBeInTheDocument()
  })

  it('renders empty records by default when prop is omitted', async () => {
    render(await YourActivity({}))

    expect(screen.getByText('statistics.noRecordsToday')).toBeInTheDocument()
  })
})
