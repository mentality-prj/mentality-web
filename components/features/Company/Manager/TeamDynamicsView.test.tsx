import { fireEvent, render, screen } from '@testing-library/react'

import { TeamDynamicsView } from '@/components/features/Company/Manager/TeamDynamicsView'
import { useTeamDynamics } from '@/hooks/useTeamDynamics'

jest.mock('next-intl', () => ({ useLocale: () => 'en' }))
jest.mock('@/helpers/reportingCopy', () => ({
  getReportingCopy: () => ({
    common: {
      refresh: 'Refresh',
      from: 'From',
      to: 'To',
      confidence: 'Confidence',
    },
    diagnostics: {
      team: 'Team',
      teamPlaceholder: 'Select team',
      noTeamsAvailable: 'No teams available',
    },
    teamDynamics: {
      title: 'Team dynamics',
      aggregateTrend: 'Aggregate trend',
      heatmap: 'Heatmap',
      insightCards: 'Insight cards',
      trendDetail: 'Trend detail',
      keyChanges: 'Key changes',
      recommendedInterventions: 'Recommended interventions',
      privacyState: 'Privacy state',
    },
  }),
}))

jest.mock('@/hooks/useTeamDynamics', () => ({ useTeamDynamics: jest.fn() }))
jest.mock('@/components/shared/reporting/ReportingPrimitives', () => ({
  InsightCardPanel: ({ card }: { card: { title: string; text?: string | null } }) => (
    <div>
      <span>{card.title}</span>
      {card.text ? <span>{card.text}</span> : null}
    </div>
  ),
}))

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AreaChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CartesianGrid: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  Area: () => null,
  Line: () => null,
}))

function createTeamOption() {
  return {
    id: 'team-1',
    name: 'Team A',
    type: 'team' as const,
    companyId: 'company-1',
    parentGroupId: null,
    children: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }
}

function createTeamDynamicsState(overrides: Partial<ReturnType<typeof useTeamDynamics>> = {}) {
  return {
    teamId: 'team-1',
    setTeamId: jest.fn(),
    teamOptions: [createTeamOption()],
    teamsLoading: false,
    teamsError: null,
    from: '2026-01-01',
    to: '2026-01-31',
    setFrom: jest.fn(),
    setTo: jest.fn(),
    teamDynamics: null,
    loading: false,
    error: null,
    dateError: null,
    refresh: jest.fn(),
    ...overrides,
  }
}

function createInsightCard(title: string) {
  return {
    id: title,
    title,
    text: `${title} text`,
    supportingText: null,
    tone: 'neutral' as const,
    presentation: 'textInsight' as const,
    confidence: null,
    recommendedAction: null,
    updatedAt: null,
    visibilityRules: [],
  }
}

describe('TeamDynamicsView', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows a loading placeholder and disables refresh while loading', () => {
    ;(useTeamDynamics as jest.Mock).mockReturnValue(createTeamDynamicsState({ loading: true }))

    const { container } = render(<TeamDynamicsView />)

    expect(screen.getByRole('button', { name: 'Refresh' })).toBeDisabled()
    expect(container.querySelector('.animate-pulse')).toBeTruthy()
  })

  it('forwards date filter changes and renders loaded team dynamics content', () => {
    const setFrom = jest.fn()
    const setTo = jest.fn()
    const refresh = jest.fn()

    ;(useTeamDynamics as jest.Mock).mockReturnValue(
      createTeamDynamicsState({
        teamId: 'team-1',
        teamOptions: [createTeamOption()],
        setFrom,
        setTo,
        refresh,
        dateError: 'Invalid range',
        error: 'Load failed',
        teamDynamics: {
          aggregateTrend: {
            title: 'Trend',
            points: [{ label: 'Week 1', value: 3, baseline: 2, confidence: 0.9 }],
          },
          propagationRisk: createInsightCard('Propagation risk'),
          synchronizedDeterioration: createInsightCard('Synchronized deterioration'),
          confidence: {
            id: 'confidence',
            level: 'high',
            label: 'High confidence',
            score: 0.9,
            reason: 'Stable signal',
            improveQualityHint: null,
            visibilityRules: [],
          },
          insightCards: [createInsightCard('Team insight')],
          heatmap: [{ id: 'row-1', label: 'Team A', intensity: 'high', aggregateLabel: '3.8', visibilityRules: [] }],
          trendDetail: {
            keyChanges: ['Change 1'],
            recommendedInterventions: ['Intervention 1'],
            privacyState: 'Aggregated',
          },
          visibilityRules: [],
        },
      })
    )

    render(<TeamDynamicsView />)

    fireEvent.change(screen.getByLabelText('From'), { target: { value: '2026-02-01' } })
    fireEvent.change(screen.getByLabelText('To'), { target: { value: '2026-02-28' } })
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))

    expect(setFrom).toHaveBeenCalledWith('2026-02-01')
    expect(setTo).toHaveBeenCalledWith('2026-02-28')
    expect(refresh).toHaveBeenCalled()
    expect(screen.getByText('Invalid range')).toBeInTheDocument()
    expect(screen.getByText('Load failed')).toBeInTheDocument()
    expect(screen.getAllByText('Team A').length).toBeGreaterThan(0)
    expect(screen.getByText('High confidence')).toBeInTheDocument()
  })
})
