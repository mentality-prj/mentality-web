import { render, screen } from '@testing-library/react'

import { ServicesAudienceShowcase } from '@/app/[locale]/(public)/components/ServicesAudienceShowcase'

const translations: Record<string, string> = {
  'hero.title': 'Hero title',
  'hero.subtitle': 'Hero subtitle',
  'blueprint.title': 'Blueprint title',
  'blueprint.subtitle': 'Blueprint subtitle',
  'blueprint.cards.personalFlow.title': 'Blueprint card one',
  'blueprint.cards.personalFlow.description': 'Blueprint card one description',
  'blueprint.cards.personalFlow.focus': 'Blueprint card one focus',
  'blueprint.cards.corporateFlow.title': 'Blueprint card two',
  'blueprint.cards.corporateFlow.description': 'Blueprint card two description',
  'blueprint.cards.corporateFlow.focus': 'Blueprint card two focus',
  'blueprint.cards.researchFlow.title': 'Blueprint card three',
  'blueprint.cards.researchFlow.description': 'Blueprint card three description',
  'blueprint.cards.researchFlow.focus': 'Blueprint card three focus',
  'hero.audiences.b2c.title': 'Personal',
  'hero.audiences.b2c.subtitle': 'B2C subtitle',
  'hero.audiences.b2b.title': 'Corporate',
  'hero.audiences.b2b.subtitle': 'B2B subtitle',
  'hero.audiences.rd.title': 'Research',
  'hero.audiences.rd.subtitle': 'R&D subtitle',
  'sections.b2c.tag': 'Personal',
  'sections.b2c.title': 'For individuals',
  'sections.b2c.description': 'Personal description',
  'sections.b2c.serviceSummaryItems.tracking': 'Collects state signals into one sequence.',
  'sections.b2c.serviceSummaryItems.support': 'Suggests a relevant practice right after self-check.',
  'sections.b2c.serviceSummaryItems.consistency': 'Keeps change history easy to revisit.',
  'sections.b2c.resultSummaryItems.one': 'State becomes easier to understand over time.',
  'sections.b2c.resultSummaryItems.two': 'The next step is clear right after assessment.',
  'sections.b2c.resultSummaryItems.three': 'Support turns into a path that is easy to continue every day.',
  'sections.b2c.journeyTitle': 'How the service works',
  'sections.b2c.before.title': 'What it was before',
  'sections.b2c.before.items.one.title': 'Separate signals without a shared picture',
  'sections.b2c.before.items.one.description': 'Before state description one',
  'sections.b2c.before.items.two.title': 'Practices were not linked to the moment',
  'sections.b2c.before.items.two.description': 'Before state description two',
  'sections.b2c.before.items.three.title': 'Results did not accumulate in one story',
  'sections.b2c.before.items.three.description': 'Before state description three',
  'sections.b2c.capabilities.tracking.title': 'Track state',
  'sections.b2c.capabilities.tracking.description': 'Track description',
  'sections.b2c.capabilities.support.title': 'Act immediately',
  'sections.b2c.capabilities.support.description': 'Support description',
  'sections.b2c.capabilities.consistency.title': 'Stay engaged',
  'sections.b2c.capabilities.consistency.description': 'Consistency description',
  'sections.b2c.outcomesTitle': 'What improved',
  'sections.b2c.after.items.one.title': 'State becomes clearer over time',
  'sections.b2c.after.items.one.description': 'Improved state description one',
  'sections.b2c.after.items.two.title': 'The next step becomes concrete',
  'sections.b2c.after.items.two.description': 'Improved state description two',
  'sections.b2c.after.items.three.title': 'Support becomes cumulative',
  'sections.b2c.after.items.three.description': 'Improved state description three',
  'sections.b2c.outcomes.one': 'Outcome one',
  'sections.b2c.outcomes.two': 'Outcome two',
  'sections.b2c.outcomes.three': 'Outcome three',
  'sections.b2c.chart.label': 'Self-check score',
  'sections.b2c.chart.title': 'Personal trajectory',
  'sections.b2c.chart.stubTitle': 'Illustrative personal trajectory',
  'sections.b2b.tag': 'Corporate',
  'sections.b2b.title': 'For companies',
  'sections.b2b.description': 'Corporate description',
  'sections.b2b.managerTitle': 'What a manager sees and controls',
  'sections.b2b.capabilities.governance.title': 'Structure the organization',
  'sections.b2b.capabilities.governance.description': 'Governance description',
  'sections.b2b.capabilities.analytics.title': 'Monitor teams',
  'sections.b2b.capabilities.analytics.description': 'Analytics description',
  'sections.b2b.capabilities.decisionSupport.title': 'Act on risk',
  'sections.b2b.capabilities.decisionSupport.description': 'Decision support description',
  'sections.b2b.outcomesTitle': 'What this gives the business',
  'sections.b2b.businessImpact.one.title': 'One management surface for team well-being',
  'sections.b2b.businessImpact.one.description': 'Business impact description one',
  'sections.b2b.businessImpact.two.title': 'Faster decisions with measurable operational payoff',
  'sections.b2b.businessImpact.two.description': 'Business impact description two',
  'sections.b2b.businessImpact.three.title': 'A stronger case for HR and executive buy-in',
  'sections.b2b.businessImpact.three.description': 'Business impact description three',
  'sections.b2b.outcomes.one': 'Outcome one',
  'sections.b2b.outcomes.two': 'Outcome two',
  'sections.b2b.outcomes.three': 'Outcome three',
  'sections.b2b.chart.label': 'Average stress score',
  'sections.b2b.chart.title': 'Team risk trajectory',
  'sections.b2b.chart.stubTitle': 'Illustrative team risk trajectory',
  'sections.rd.tag': 'Research',
  'sections.rd.title': 'For researchers, institutes and universities',
  'sections.rd.description': 'Research description',
  'sections.rd.technicalTitle': 'Technical research layer',
  'sections.rd.capabilities.cohorts.title': 'Build comparable cohorts',
  'sections.rd.capabilities.cohorts.description': 'Cohorts description',
  'sections.rd.capabilities.validation.title': 'Validate predictions',
  'sections.rd.capabilities.validation.description': 'Validation description',
  'sections.rd.capabilities.reporting.title': 'Report impact',
  'sections.rd.capabilities.reporting.description': 'Reporting description',
  'sections.rd.panels.delivery.title': 'What we actually do',
  'sections.rd.panels.delivery.items.one.title': 'Collect standardized observations',
  'sections.rd.panels.delivery.items.one.description': 'Collect description',
  'sections.rd.panels.delivery.items.two.title': 'Build cohorts and analytical cuts',
  'sections.rd.panels.delivery.items.two.description': 'Cohort cut description',
  'sections.rd.panels.delivery.items.three.title': 'Validate predictions against outcomes',
  'sections.rd.panels.delivery.items.three.description': 'Validation against outcomes description',
  'sections.rd.panels.science.title': 'Scientific value',
  'sections.rd.panels.science.items.one.title': 'Repeatable measurement logic',
  'sections.rd.panels.science.items.one.description': 'Measurement logic description',
  'sections.rd.panels.science.items.two.title': 'Visible drift and accuracy',
  'sections.rd.panels.science.items.two.description': 'Drift description',
  'sections.rd.panels.science.items.three.title': 'Evidence for papers and grants',
  'sections.rd.panels.science.items.three.description': 'Papers and grants description',
  'sections.rd.panels.support.title': 'How we help researchers',
  'sections.rd.panels.support.items.one.title': 'Reduce time to a working study design',
  'sections.rd.panels.support.items.one.description': 'Working study design description',
  'sections.rd.panels.support.items.two.title': 'Provide structure for reports and papers',
  'sections.rd.panels.support.items.two.description': 'Reports and papers description',
  'sections.rd.panels.support.items.three.title': 'Strengthen grant reasoning',
  'sections.rd.panels.support.items.three.description': 'Grant reasoning description',
  'sections.rd.outcomesTitle': 'What researchers and institutions get',
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
        name: 'Hero title',
        level: 1,
      })
    ).toBeInTheDocument()
    expect(screen.getByText('Hero subtitle')).toBeInTheDocument()
    expect(screen.getByText('B2C subtitle')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'Blueprint title',
        level: 2,
      })
    ).toBeInTheDocument()
    expect(screen.getByText('Blueprint card two')).toBeInTheDocument()
  })

  it('renders all audience sections with distinct B2C, B2B and R&D layouts', () => {
    render(<ServicesAudienceShowcase />)

    expect(screen.getByRole('heading', { name: 'For individuals', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'For companies', level: 2 })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'For researchers, institutes and universities', level: 2 })
    ).toBeInTheDocument()
    expect(screen.queryByTestId('history-chart-card')).not.toBeInTheDocument()
    expect(screen.getByText('Collects state signals into one sequence.')).toBeInTheDocument()
    expect(screen.getByText('Suggests a relevant practice right after self-check.')).toBeInTheDocument()
    expect(screen.getByText('Keeps change history easy to revisit.')).toBeInTheDocument()
    expect(screen.getByText('State becomes easier to understand over time.')).toBeInTheDocument()
    expect(screen.getByText('The next step is clear right after assessment.')).toBeInTheDocument()
    expect(screen.getByText('Support turns into a path that is easy to continue every day.')).toBeInTheDocument()
    expect(screen.queryByText('What it was before')).not.toBeInTheDocument()
    expect(screen.queryByText('How the service works')).not.toBeInTheDocument()
    expect(screen.queryByText('What improved')).not.toBeInTheDocument()
    expect(screen.getByText('What a manager sees and controls')).toBeInTheDocument()
    expect(screen.getByText('What this gives the business')).toBeInTheDocument()
    expect(screen.getByText('One management surface for team well-being')).toBeInTheDocument()
    expect(screen.getByText('Technical research layer')).toBeInTheDocument()
    expect(screen.getByText('Strengthen grant reasoning')).toBeInTheDocument()
    expect(screen.getByText('Act on risk')).toBeInTheDocument()
    expect(screen.getByText('Report impact')).toBeInTheDocument()
  })
})
