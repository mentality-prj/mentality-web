import { ComponentProps, ReactNode } from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import {
  DecisionSupportPanel,
  filterRiskEventsByControls,
} from '@/components/features/Company/Manager/DecisionSupport/DecisionSupportPanel'
import { RiskEventViewModel } from '@/types/decisionSupport'

const toastSuccessMock = jest.fn()

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: (...args: unknown[]) => toastSuccessMock(...args),
  },
}))

jest.mock('next-intl', () => ({
  useTranslations: () => {
    const translate = ((key: string) => key) as ((key: string) => string) & { has: (key: string) => boolean }
    translate.has = () => true
    return translate
  },
}))

jest.mock('@/ui/select', () => ({
  Select: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children, ...props }: { children: ReactNode }) => <div {...props}>{children}</div>,
  SelectValue: () => <span />,
  SelectContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

const baseRiskEvent: RiskEventViewModel = {
  id: 'evt-1',
  severity: 'high',
  confidence: 0.8,
  explanationShort: 'High stress trend detected',
  financialRange: 'EUR 1000 - 3000',
  status: 'active',
}

function createProps(overrides?: Partial<ComponentProps<typeof DecisionSupportPanel>>) {
  return {
    riskEvents: [baseRiskEvent],
    loading: false,
    processingEventIds: new Set<string>(),
    loadingOutcomeEventIds: new Set<string>(),
    outcomeByEventId: {
      'evt-1': {
        status: 'active',
        effectSize: 0.33,
        history: ['history item'],
        actions: ['action item'],
        outcome: 'Improving',
      },
    },
    fetchRiskEventOutcome: jest.fn().mockResolvedValue({ status: 'active' }),
    applyAction: jest.fn().mockResolvedValue(true),
    resolveRisk: jest.fn().mockResolvedValue(true),
    refresh: jest.fn().mockResolvedValue(undefined),
    error: null,
    ...overrides,
  }
}

describe('filterRiskEventsByControls', () => {
  const events: RiskEventViewModel[] = [
    { ...baseRiskEvent, id: 'high-active', severity: 'high', status: 'active', confidence: 0.9 },
    { ...baseRiskEvent, id: 'medium-resolved', severity: 'medium', status: 'resolved', confidence: 0.5 },
    { ...baseRiskEvent, id: 'low-escalating', severity: 'low', status: 'escalating', confidence: 0.2 },
    { ...baseRiskEvent, id: 'unknown-confidence', severity: 'high', status: 'active', confidence: null },
  ]

  it('filters by severity and status', () => {
    const filtered = filterRiskEventsByControls(events, 'high', 'active', 'all')
    expect(filtered.map((item) => item.id)).toEqual(['high-active', 'unknown-confidence'])
  })

  it('filters by confidence buckets', () => {
    expect(filterRiskEventsByControls(events, 'all', 'all', 'high').map((item) => item.id)).toEqual(['high-active'])
    expect(filterRiskEventsByControls(events, 'all', 'all', 'medium').map((item) => item.id)).toEqual([
      'medium-resolved',
    ])
    expect(filterRiskEventsByControls(events, 'all', 'all', 'low').map((item) => item.id)).toEqual([
      'low-escalating',
      'unknown-confidence',
    ])
  })
})

describe('DecisionSupportPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders empty state when no risk events', () => {
    render(<DecisionSupportPanel {...createProps({ riskEvents: [] })} />)

    expect(screen.getByText('empty.title')).toBeInTheDocument()
    expect(screen.getByText('empty.description')).toBeInTheDocument()
  })

  it('applies action when action button is clicked', async () => {
    const props = createProps()
    render(<DecisionSupportPanel {...props} />)

    fireEvent.click(screen.getByText('riskCard.takeAction'))
    fireEvent.click(screen.getByText('actionMenu.options.oneOnOneMeeting'))

    await waitFor(() => {
      expect(props.applyAction).toHaveBeenCalledWith('evt-1', { actionType: 'one_on_one_meeting' })
    })
    expect(toastSuccessMock).toHaveBeenCalledWith('actionMenu.success')
  })

  it('submits resolve note and clears textarea on success', async () => {
    const props = createProps()
    render(<DecisionSupportPanel {...props} />)

    fireEvent.click(screen.getByText('riskCard.viewDetails'))

    await waitFor(() => {
      expect(props.fetchRiskEventOutcome).toHaveBeenCalledWith('evt-1')
    })

    const textarea = screen.getByLabelText('resolve.noteLabel')
    fireEvent.change(textarea, { target: { value: 'Need follow-up' } })
    fireEvent.click(screen.getByText('resolve.submit'))

    await waitFor(() => {
      expect(props.resolveRisk).toHaveBeenCalledWith('evt-1', { note: 'Need follow-up' })
    })
    expect(toastSuccessMock).toHaveBeenCalledWith('resolve.success')
    await waitFor(() => {
      expect((screen.getByLabelText('resolve.noteLabel') as HTMLTextAreaElement).value).toBe('')
    })
  })

  it('disables retry button while loading', () => {
    const props = createProps({ loading: true, error: 'serverError' })
    render(<DecisionSupportPanel {...props} />)

    expect(screen.getByText('retry')).toBeDisabled()
  })

  it('does not render blank history/action list items', async () => {
    const props = createProps({
      outcomeByEventId: {
        'evt-1': {
          status: 'active',
          history: [{}, 'history item'],
          actions: [{}, 'action item'],
          outcome: 'ok',
        },
      },
    })

    render(<DecisionSupportPanel {...props} />)
    fireEvent.click(screen.getByText('riskCard.viewDetails'))

    await waitFor(() => {
      expect(props.fetchRiskEventOutcome).toHaveBeenCalledWith('evt-1')
    })

    expect(screen.getByText('history item')).toBeInTheDocument()
    expect(screen.getByText('action item')).toBeInTheDocument()

    const listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(2)
    expect(listItems.every((item) => item.textContent?.trim().length)).toBe(true)
  })
})
