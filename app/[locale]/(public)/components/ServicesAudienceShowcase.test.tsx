import { render, screen } from '@testing-library/react'

import { ServicesAudienceShowcase } from '@/app/[locale]/(public)/components/ServicesAudienceShowcase'

const translations: Record<string, string> = {
  'hero.eyebrow': 'Dzvin.co services',
  'hero.title': 'One platform for personal support, corporate analytics and research validation',
  'hero.subtitle': 'Subtitle',
  'hero.note': 'Illustrative data note',
  'blueprint.eyebrow': 'Service architecture',
  'blueprint.title': 'The services page explains a different operating model than the landing page',
  'blueprint.subtitle': 'Blueprint subtitle',
  'blueprint.cards.personalFlow.title': 'Personal support track',
  'blueprint.cards.personalFlow.description': 'Personal flow description',
  'blueprint.cards.personalFlow.focus': 'Personal focus',
  'blueprint.cards.corporateFlow.title': 'Corporate operations track',
  'blueprint.cards.corporateFlow.description': 'Corporate flow description',
  'blueprint.cards.corporateFlow.focus': 'Corporate focus',
  'blueprint.cards.researchFlow.title': 'Research validation track',
  'blueprint.cards.researchFlow.description': 'Research flow description',
  'blueprint.cards.researchFlow.focus': 'Research focus',
  'hero.audiences.b2c.title': 'Personal',
  'hero.audiences.b2c.subtitle': 'B2C subtitle',
  'hero.audiences.b2b.title': 'Corporate',
  'hero.audiences.b2b.subtitle': 'B2B subtitle',
  'hero.audiences.rd.title': 'Research',
  'hero.audiences.rd.subtitle': 'R&D subtitle',
  'sections.b2c.tag': 'Personal',
  'sections.b2c.title': 'For individuals',
  'sections.b2c.description': 'Personal description',
  'sections.b2c.capabilities.tracking.title': 'Track state',
  'sections.b2c.capabilities.tracking.description': 'Track description',
  'sections.b2c.capabilities.support.title': 'Act immediately',
  'sections.b2c.capabilities.support.description': 'Support description',
  'sections.b2c.capabilities.consistency.title': 'Stay engaged',
  'sections.b2c.capabilities.consistency.description': 'Consistency description',
  'sections.b2c.outcomesTitle': 'What people get',
  'sections.b2c.outcomes.one': 'Outcome one',
  'sections.b2c.outcomes.two': 'Outcome two',
  'sections.b2c.outcomes.three': 'Outcome three',
  'sections.b2c.chart.label': 'Self-check score',
  'sections.b2c.chart.title': 'Personal trajectory',
  'sections.b2c.chart.stubTitle': 'Illustrative personal trajectory',
  'sections.b2b.tag': 'Corporate',
  'sections.b2b.title': 'For companies',
  'sections.b2b.description': 'Corporate description',
  'sections.b2b.capabilities.governance.title': 'Structure the organization',
  'sections.b2b.capabilities.governance.description': 'Governance description',
  'sections.b2b.capabilities.analytics.title': 'Monitor teams',
  'sections.b2b.capabilities.analytics.description': 'Analytics description',
  'sections.b2b.capabilities.decisionSupport.title': 'Act on risk',
  'sections.b2b.capabilities.decisionSupport.description': 'Decision support description',
  'sections.b2b.outcomesTitle': 'What companies get',
  'sections.b2b.outcomes.one': 'Outcome one',
  'sections.b2b.outcomes.two': 'Outcome two',
  'sections.b2b.outcomes.three': 'Outcome three',
  'sections.b2b.chart.label': 'Average stress score',
  'sections.b2b.chart.title': 'Team risk trajectory',
  'sections.b2b.chart.stubTitle': 'Illustrative team risk trajectory',
  'sections.rd.tag': 'Research',
  'sections.rd.title': 'For research programs and foundations',
  'sections.rd.description': 'Research description',
  'sections.rd.capabilities.cohorts.title': 'Build comparable cohorts',
  'sections.rd.capabilities.cohorts.description': 'Cohorts description',
  'sections.rd.capabilities.validation.title': 'Validate predictions',
  'sections.rd.capabilities.validation.description': 'Validation description',
  'sections.rd.capabilities.reporting.title': 'Report impact',
  'sections.rd.capabilities.reporting.description': 'Reporting description',
  'sections.rd.outcomesTitle': 'What funds and researchers get',
  'sections.rd.outcomes.one': 'Outcome one',
  'sections.rd.outcomes.two': 'Outcome two',
  'sections.rd.outcomes.three': 'Outcome three',
  'sections.rd.chart.label': 'Forecast error',
  'sections.rd.chart.title': 'Validation cycle',
  'sections.rd.chart.stubTitle': 'Illustrative validation cycle',
}

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => translations[key as keyof typeof translations] ?? key,
}))

jest.mock('@/app/[locale]/(public)/components/StaticHistoryChartCard', () => ({
  StaticHistoryChartCard: ({ stubTitle, chartLabel }: { stubTitle: string; chartLabel: string }) => (
    <div data-testid="history-chart-card">
      <span>{stubTitle}</span>
      <span>{chartLabel}</span>
    </div>
  ),
}))

describe('ServicesAudienceShowcase', () => {
  it('renders the hero content and the dedicated service blueprint section', () => {
    render(<ServicesAudienceShowcase />)

    expect(
      screen.getByRole('heading', {
        name: 'One platform for personal support, corporate analytics and research validation',
        level: 1,
      })
    ).toBeInTheDocument()
    expect(screen.getByText('Illustrative data note')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'The services page explains a different operating model than the landing page',
        level: 2,
      })
    ).toBeInTheDocument()
    expect(screen.getByText('Corporate operations track')).toBeInTheDocument()
  })

  it('renders all audience sections and three illustrative charts', () => {
    render(<ServicesAudienceShowcase />)

    expect(screen.getByRole('heading', { name: 'For individuals', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'For companies', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'For research programs and foundations', level: 2 })).toBeInTheDocument()
    expect(screen.getAllByTestId('history-chart-card')).toHaveLength(3)
    expect(screen.getByText('Act on risk')).toBeInTheDocument()
    expect(screen.getByText('Report impact')).toBeInTheDocument()
  })
})
