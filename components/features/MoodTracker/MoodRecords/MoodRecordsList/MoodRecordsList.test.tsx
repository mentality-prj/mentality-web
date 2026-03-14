import { render, screen } from '@testing-library/react'
import { useTranslations } from 'next-intl'

import { MoodRecordsList } from '@/components/features/MoodTracker/MoodRecords/MoodRecordsList/MoodRecordsList'
import { MoodRecordEntity } from '@/types/api-responses'

jest.mock('next-intl')

jest.mock('@/components/shared/Cards/Card', () => ({
  __esModule: true,
  default: ({
    children,
    title,
    text,
    tags,
  }: {
    children?: React.ReactNode
    title?: React.ReactNode
    text?: React.ReactNode
    tags?: string[]
  }) => (
    <div data-testid="mood-record-card">
      {title && <h3>{title}</h3>}
      {text && <div data-testid="card-text">{text}</div>}
      {tags?.map((tag) => (
        <span key={tag} data-testid="record-tag">
          {tag}
        </span>
      ))}
      {children}
    </div>
  ),
}))

jest.mock('@/ds/components/Tag', () => ({
  Tag: ({ text }: { text: string }) => <span data-testid="level-tag">{text}</span>,
}))

const mockRecord = (overrides?: Partial<MoodRecordEntity>): MoodRecordEntity => ({
  id: '1',
  moodLevel: 3,
  stressLevel: 2,
  energyLevel: 3,
  focusLevel: 3,
  tags: [],
  createdAt: '2026-03-14T10:00:00.000Z',
  ...overrides,
})

beforeEach(() => {
  ;(useTranslations as jest.Mock).mockReturnValue((key: string) => key)
})

describe('MoodRecordsList', () => {
  it('renders a card for each record', () => {
    render(<MoodRecordsList records={[mockRecord({ id: '1' }), mockRecord({ id: '2' })]} />)

    expect(screen.getAllByTestId('mood-record-card')).toHaveLength(2)
  })

  it('renders stress, energy and focus labels', () => {
    render(<MoodRecordsList records={[mockRecord()]} />)

    // label spans show stress/energy/focus from commonGeneral
    expect(screen.getAllByText(/stress/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/energy/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/focus/i).length).toBeGreaterThanOrEqual(1)
  })

  it('renders a Tag for each level dimension', () => {
    render(<MoodRecordsList records={[mockRecord()]} />)

    // 3 level tags per record: stress, energy, focus
    expect(screen.getAllByTestId('level-tag')).toHaveLength(3)
  })

  it('renders record tags when present', () => {
    render(<MoodRecordsList records={[mockRecord({ tags: ['calm', 'rested'] })]} />)

    expect(screen.getByText('calm')).toBeInTheDocument()
    expect(screen.getByText('rested')).toBeInTheDocument()
  })

  it('renders correct number of level tags for multiple records', () => {
    render(<MoodRecordsList records={[mockRecord({ id: '1' }), mockRecord({ id: '2' })]} />)

    // 3 level tags × 2 records = 6
    expect(screen.getAllByTestId('level-tag')).toHaveLength(6)
  })

  it('renders an empty list without crashing', () => {
    const { container } = render(<MoodRecordsList records={[]} />)

    expect(container.firstChild).toBeInTheDocument()
    expect(screen.queryByTestId('mood-record-card')).not.toBeInTheDocument()
  })

  it('renders createdAt date for each record', () => {
    render(<MoodRecordsList records={[mockRecord({ createdAt: '2026-03-14T10:00:00.000Z' })]} />)

    // Date rendered inside a div, check it's not empty
    const dateDiv = document.querySelector('.text-gray-400')
    expect(dateDiv?.textContent).toBeTruthy()
  })
})
