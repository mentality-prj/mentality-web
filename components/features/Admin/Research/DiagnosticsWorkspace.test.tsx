import { render, screen } from '@testing-library/react'

import { DiagnosticsWorkspace } from '@/components/features/Admin/Research/DiagnosticsWorkspace'
import { useMLInspection } from '@/hooks/useMLInspection'

jest.mock('next-intl', () => ({ useLocale: () => 'en' }))
jest.mock('@/helpers/reportingCopy', () => ({
  getReportingCopy: () => ({
    common: {
      refresh: 'Refresh',
      noData: 'No data',
      unavailableDiagnostics: 'Diagnostics unavailable',
      confidence: 'Confidence',
    },
    diagnostics: {
      inspectionTitle: 'Diagnostics workspace',
      detailsTab: 'Details',
      diagnosticsTab: 'Diagnostics',
      auditTrail: 'Audit trail',
      policySummary: 'Policy summary',
    },
  }),
}))

jest.mock('@/hooks/useMLInspection', () => ({ useMLInspection: jest.fn() }))

jest.mock('@/components/shared/reporting/ReportingPrimitives', () => ({
  ConfidenceIndicator: ({ badge }: { badge: { label: string } }) => <div>{badge.label}</div>,
  InsightCardPanel: ({ card }: { card: { title: string } }) => <div>{card.title}</div>,
}))

jest.mock('@/ui/button', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}))

jest.mock('@/ui/tabs', () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsTrigger: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,
  TabsContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

function createInspectionState(overrides: Partial<ReturnType<typeof useMLInspection>> = {}) {
  return {
    teamId: '',
    targetId: 'global-admin',
    inspection: null,
    loading: false,
    error: null,
    refresh: jest.fn(),
    setTeamId: jest.fn(),
    ...overrides,
  }
}

describe('DiagnosticsWorkspace', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useMLInspection as jest.Mock).mockReturnValue(createInspectionState())
  })

  it('renders a global diagnostics workspace without company or team selectors', () => {
    render(<DiagnosticsWorkspace />)

    expect(screen.getByRole('button', { name: 'Refresh' })).toBeEnabled()
    expect(screen.queryByText('Team')).not.toBeInTheDocument()
    expect(screen.getByText('No data')).toBeInTheDocument()
  })

  it('shows the diagnostics error without rendering the empty-state copy', () => {
    ;(useMLInspection as jest.Mock).mockReturnValue(
      createInspectionState({
        error: 'Company boundary for diagnostics surface is not defined',
      })
    )

    render(<DiagnosticsWorkspace />)

    expect(screen.getByText('Company boundary for diagnostics surface is not defined')).toBeInTheDocument()
    expect(screen.queryByText('No data')).not.toBeInTheDocument()
  })

  it('renders inspection cards, audit details, and diagnostics facts when available', () => {
    ;(useMLInspection as jest.Mock).mockReturnValue(
      createInspectionState({
        inspection: {
          targetType: 'company',
          targetId: 'global-admin',
          cards: {
            riskScore: {
              id: 'risk',
              title: 'Risk score',
              text: '42%',
              supportingText: null,
              tone: 'neutral',
              presentation: 'badge',
              confidence: null,
              recommendedAction: null,
              updatedAt: null,
              visibilityRules: ['diagnostics-only'],
            },
            anomaly: {
              id: 'anomaly',
              title: 'Anomaly',
              text: '12%',
              supportingText: null,
              tone: 'neutral',
              presentation: 'badge',
              confidence: null,
              recommendedAction: null,
              updatedAt: null,
              visibilityRules: ['diagnostics-only'],
            },
            probability: {
              id: 'probability',
              title: 'Probability',
              text: '80%',
              supportingText: null,
              tone: 'neutral',
              presentation: 'badge',
              confidence: null,
              recommendedAction: null,
              updatedAt: null,
              visibilityRules: ['diagnostics-only'],
            },
            modelVersion: {
              id: 'model',
              title: 'Model version',
              text: 'N/A',
              supportingText: null,
              tone: 'neutral',
              presentation: 'badge',
              confidence: null,
              recommendedAction: null,
              updatedAt: null,
              visibilityRules: ['diagnostics-only'],
            },
          },
          details: [
            {
              id: 'audit-1',
              title: 'policy_override',
              text: 'system',
              supportingText: '2026-05-19T10:00:00.000Z',
              tone: 'neutral',
              presentation: 'textInsight',
              confidence: null,
              recommendedAction: null,
              updatedAt: null,
              visibilityRules: ['diagnostics-only'],
            },
          ],
          diagnostics: [{ label: 'Total events', value: '12' }],
          confidence: {
            id: 'confidence',
            level: 'high',
            label: 'High',
            score: 0.82,
            reason: 'Stable',
            improveQualityHint: null,
            visibilityRules: ['diagnostics-only'],
          },
          visibilityRules: ['diagnostics-only'],
        },
      })
    )

    render(<DiagnosticsWorkspace />)

    expect(screen.getByText('Risk score')).toBeInTheDocument()
    expect(screen.getByText('policy_override')).toBeInTheDocument()
    expect(screen.getByText('Total events')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
  })
})
