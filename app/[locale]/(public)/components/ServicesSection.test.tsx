import { render, screen } from '@testing-library/react'

import { ServicesSection } from '@/app/[locale]/(public)/components/ServicesSection'

const translations: Record<string, string> = {
  'Services.title': 'Small moments of self-care\nevery day',
  'Services.cards.intro.text': 'Intro text',
  'Services.cards.cohortEvidence.title': 'A space to write',
  'Services.cards.cohortEvidence.text': 'Journal entry help',
  'Services.cards.scenarioSimulation.title': 'Breathing and calming',
  'Services.cards.scenarioSimulation.text': 'Choose simple exercises',
  'Services.cards.predictionEngine.title': 'Your history',
  'Services.cards.predictionEngine.text': 'Review your check-ins',
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
      name: /Small moments of self-care\s+every day/,
      level: 2,
    })

    expect(heading).toHaveClass('whitespace-pre-line')
    expect(heading.textContent).toContain('\n')
  })

  it('renders all configured service cards', () => {
    render(<ServicesSection />)

    expect(screen.getAllByTestId('vertical-card')).toHaveLength(4)
    expect(screen.getByText('Intro text')).toBeInTheDocument()
    expect(screen.getByText('A space to write')).toBeInTheDocument()
    expect(screen.getByText('Breathing and calming')).toBeInTheDocument()
    expect(screen.getByText('Your history')).toBeInTheDocument()
  })
})
