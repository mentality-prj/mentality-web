import { fireEvent, render, screen } from '@testing-library/react'

import { PersonalRiskDashboard } from '@/components/features/Statistics/PersonalRiskDashboard'
import { PersonalRiskOverviewVM, PersonalRiskTimelineVM } from '@/types/reporting'

jest.mock('next-intl', () => ({ useLocale: () => 'en' }))
jest.mock('@/helpers/reportingCopy', () => ({
  getReportingCopy: () => ({
    common: { notAvailable: 'Not available' },
    personalRisk: {
      overviewTitle: 'Personal risk overview',
      timelineTitle: 'Risk timeline',
      topInsights: 'Top insights',
      updatedTime: 'Updated',
      trendDirection: 'Trend direction',
      baselineReference: 'Baseline reference',
      whySeeingThis: 'Why am I seeing this?',
      recentChanges: 'Recent changes',
      contributingFactors: 'Contributing factors',
      dataCompleteness: 'Data completeness',
      period7d: '7 days',
      period14d: '14 days',
      period30d: '30 days',
    },
  }),
}))

jest.mock('@/components/shared/reporting/ReportingPrimitives', () => ({
  ConfidenceIndicator: ({ badge }: { badge: { label: string } }) => <div>{badge.label}</div>,
  InsightCardPanel: ({ card }: { card: { title: string } }) => <div>{card.title}</div>,
  StateExplanationCard: ({ card }: { card: { title: string } }) => <div>{card.title}</div>,
  WhyAmISeeingThisCard: ({ value }: { value: { explanationText: string } }) => <div>{value.explanationText}</div>,
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

jest.mock('@/ui/tabs', () => {
  const React = jest.requireActual<typeof import('react')>('react')
  const TabsContext = React.createContext<{ onValueChange?: (value: string) => void }>({})

  return {
    Tabs: ({ children, onValueChange }: { children: React.ReactNode; onValueChange?: (value: string) => void }) => (
      <TabsContext.Provider value={{ onValueChange }}>{children}</TabsContext.Provider>
    ),
    TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    TabsTrigger: ({ children, value }: { children: React.ReactNode; value: string }) => {
      const context = React.useContext(TabsContext)
      return (
        <button type="button" onClick={() => context.onValueChange?.(value)}>
          {children}
        </button>
      )
    },
  }
})

function createConfidence(label: string) {
  return {
    id: `${label}-confidence`,
    level: 'high' as const,
    label,
    score: 0.9,
    reason: `${label} reason`,
    improveQualityHint: null,
    visibilityRules: [],
  }
}

function createInsightCard(id: string, title: string) {
  return {
    id,
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

function createTimeline(
  period: '7d' | '14d' | '30d',
  trendDirection: string,
  baselineReferenceLabel: string
): PersonalRiskTimelineVM {
  return {
    period,
    trendDirection: trendDirection as PersonalRiskTimelineVM['trendDirection'],
    confidence: createConfidence(`${period} confidence`),
    points: [
      {
        label: `${period} point`,
        value: 3,
        baseline: 2,
        confidence: 0.9,
      },
    ],
    baselineReferenceLabel,
    explanationCards: [],
    whySeeingThis: null,
    visibilityRules: [],
  }
}

const overview: PersonalRiskOverviewVM = {
  currentRiskLevel: createInsightCard('current-risk', 'Current risk'),
  deviationFromBaseline: createInsightCard('deviation', 'Deviation from baseline'),
  confidence: createConfidence('Overall confidence'),
  recentTrend: createInsightCard('recent-trend', 'Recent trend'),
  topInsights: [createInsightCard('top-1', 'Top insight 1'), createInsightCard('top-2', 'Top insight 2')],
  updatedAt: null,
  whySeeingThis: {
    recentChanges: ['recent change'],
    contributingFactors: ['factor'],
    dataCompleteness: 'Complete',
    explanationText: 'Why this risk is shown',
  },
  visibilityRules: [],
}

describe('PersonalRiskDashboard', () => {
  it('renders default 30-day state with updatedAt fallback', () => {
    render(
      <PersonalRiskDashboard
        overview={overview}
        timelines={{
          '7d': createTimeline('7d', 'improving', '7-day baseline'),
          '14d': createTimeline('14d', 'stable', '14-day baseline'),
          '30d': createTimeline('30d', 'worsening', '30-day baseline'),
        }}
      />
    )

    expect(screen.getByRole('heading', { name: 'Personal risk overview' })).toBeInTheDocument()
    expect(screen.getByText('Updated: Not available')).toBeInTheDocument()
    expect(screen.getByText('Trend direction: worsening')).toBeInTheDocument()
    expect(screen.getByText('Baseline reference: 30-day baseline')).toBeInTheDocument()
  })

  it('switches timeline period when another tab is selected', () => {
    render(
      <PersonalRiskDashboard
        overview={overview}
        timelines={{
          '7d': createTimeline('7d', 'improving', '7-day baseline'),
          '14d': createTimeline('14d', 'stable', '14-day baseline'),
          '30d': createTimeline('30d', 'worsening', '30-day baseline'),
        }}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: '7 days' }))

    expect(screen.getByText('Trend direction: improving')).toBeInTheDocument()
    expect(screen.getByText('Baseline reference: 7-day baseline')).toBeInTheDocument()
  })
})
