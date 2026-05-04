import { render, screen } from '@testing-library/react'

import { ServicesSection } from '@/app/[locale]/(public)/components/ServicesSection'

const translations: Record<string, string> = {
  'Services.title': 'From data to predictions\nand verified decisions',
  'Services.cards.intro.text': 'Intro text',
  'Services.cards.cohortEvidence.title': 'Cohort Evidence',
  'Services.cards.cohortEvidence.text': 'Cohort evidence text',
  'Services.cards.scenarioSimulation.title': 'Scenario Simulation',
  'Services.cards.scenarioSimulation.text': 'Scenario simulation text',
  'Services.cards.predictionEngine.title': 'Prediction Engine',
  'Services.cards.predictionEngine.text': 'Prediction engine text',
}

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => translations[key as keyof typeof translations] ?? key,
}))

jest.mock('@/components/shared/Cards/CardContainer', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <section>{children}</section>,
}))

jest.mock('@/components/shared/Cards/VerticalCard', () => ({
  __esModule: true,
  default: ({ title, description }: { title?: string; description: string }) => (
    <article data-testid="vertical-card">
      {title && <h3>{title}</h3>}
      <p>{description}</p>
    </article>
  ),
}))

describe('ServicesSection', () => {
  it('renders title with class preserving translated line breaks', () => {
    render(<ServicesSection />)

    const heading = screen.getByRole('heading', {
      name: /From data to predictions\s+and verified decisions/,
      level: 2,
    })

    expect(heading).toHaveClass('whitespace-pre-line')
    expect(heading.textContent).toContain('\n')
  })

  it('renders all configured service cards', () => {
    render(<ServicesSection />)

    expect(screen.getAllByTestId('vertical-card')).toHaveLength(4)
    expect(screen.getByText('Intro text')).toBeInTheDocument()
    expect(screen.getByText('Cohort Evidence')).toBeInTheDocument()
    expect(screen.getByText('Scenario Simulation')).toBeInTheDocument()
    expect(screen.getByText('Prediction Engine')).toBeInTheDocument()
  })
})
