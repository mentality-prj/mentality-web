import { render, screen } from '@testing-library/react'

import { DecisionSupportWorkspace } from '@/components/features/Company/Manager/DecisionSupport/DecisionSupportWorkspace'
import { useReportOverview } from '@/hooks/useReportOverview'
import { useRiskEventsFeed } from '@/hooks/useRiskEventsFeed'

jest.mock('@/hooks/useReportOverview', () => ({ useReportOverview: jest.fn() }))
jest.mock('@/hooks/useRiskEventsFeed', () => ({ useRiskEventsFeed: jest.fn() }))

jest.mock('@/components/features/Company/Manager/DecisionSupport/AdminReportOverview', () => ({
  AdminReportOverview: ({
    viewerRole,
    loading,
    error,
  }: {
    viewerRole: string
    loading: boolean
    error: string | null
  }) => (
    <div data-testid="admin-report-overview">
      {viewerRole}|loading:{String(loading)}|error:{error ?? 'none'}
    </div>
  ),
}))

jest.mock('@/components/features/Company/Manager/DecisionSupport/RiskEventsFeed', () => ({
  RiskEventsFeed: ({
    viewerRole,
    mode,
    riskEvents,
  }: {
    viewerRole: string
    mode: string
    riskEvents: Array<{ id: string }>
  }) => (
    <div data-testid="risk-events-feed">
      {viewerRole}|{mode}|events:{riskEvents.length}
    </div>
  ),
}))

beforeEach(() => {
  jest.clearAllMocks()
  ;(useReportOverview as jest.Mock).mockReturnValue({
    overview: { id: 'overview-1' },
    loading: false,
    error: null,
    refresh: jest.fn(),
  })
  ;(useRiskEventsFeed as jest.Mock).mockReturnValue({
    riskEvents: [{ id: 'event-1' }],
    loading: false,
    error: null,
    processingEventIds: new Set(),
    loadingDetailIds: new Set(),
    detailsByEventId: {},
    refresh: jest.fn(),
    fetchDetails: jest.fn(),
    applyAction: jest.fn(),
    resolveRisk: jest.fn(),
  })
})

describe('DecisionSupportWorkspace', () => {
  it('uses manager-scoped hooks for manager viewers', () => {
    render(<DecisionSupportWorkspace viewerRole="manager" />)

    expect(useReportOverview).toHaveBeenCalledWith(true)
    expect(useRiskEventsFeed).toHaveBeenCalledWith(true)
    expect(screen.getByTestId('admin-report-overview')).toHaveTextContent('manager|loading:false|error:none')
    expect(screen.getByTestId('risk-events-feed')).toHaveTextContent('manager|operational|events:1')
  })

  it('uses admin scope for non-manager viewers', () => {
    render(<DecisionSupportWorkspace viewerRole="admin" />)

    expect(useReportOverview).toHaveBeenCalledWith(false)
    expect(useRiskEventsFeed).toHaveBeenCalledWith(false)
    expect(screen.getByTestId('admin-report-overview')).toHaveTextContent('admin|loading:false|error:none')
    expect(screen.getByTestId('risk-events-feed')).toHaveTextContent('admin|operational|events:1')
  })
})
