import { render, screen } from '@testing-library/react'

import { ServicesSection } from '@/app/[locale]/(public)/components/ServicesSection'

const translations: Record<string, string> = {
  'Services.title': 'Small steps\nthat bring calm',
  'Services.cards.intro.text': 'Intro text',
  'Services.cards.cohortEvidence.title': 'Journal',
  'Services.cards.cohortEvidence.text': 'Journal text',
  'Services.cards.scenarioSimulation.title': 'Breathing',
  'Services.cards.scenarioSimulation.text': 'Breathing text',
  'Services.cards.predictionEngine.title': 'History',
  'Services.cards.predictionEngine.text': 'History text',
}

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => translations[key as keyof typeof translations] ?? key,
}))

describe('ServicesSection', () => {
  it('renders title with class preserving translated line breaks', () => {
    render(<ServicesSection />)

    const heading = screen.getByRole('heading', { name: /Small steps\s+that bring calm/, level: 2 })

    expect(heading).toHaveClass('whitespace-pre-line')
    expect(heading.textContent).toContain('\n')
  })

  it('renders the intro and three illustrated tiles without stock photos', () => {
    const { container } = render(<ServicesSection />)

    expect(screen.getByText('Intro text')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(3)
    for (const title of ['Journal', 'Breathing', 'History']) {
      expect(screen.getByRole('heading', { name: title, level: 3 })).toBeInTheDocument()
    }
    expect(container.querySelectorAll('svg')).toHaveLength(3)
    expect(container.querySelector('img')).toBeNull()
  })

  it('renders clean, soft-color SVG icons without displacement, tilt, or facial artifacts', () => {
    const { container } = render(<ServicesSection />)
    const cards = [...container.querySelectorAll('article')]
    const icons = cards.map((card) => card.querySelector('svg'))

    expect(icons).toHaveLength(3)
    for (const svg of icons) {
      expect(svg).not.toBeNull()
      expect(svg).toHaveAttribute('stroke', '#675978')
      expect(svg?.querySelector('filter, feTurbulence, feDisplacementMap')).toBeNull()
      expect(svg?.parentElement?.style.getPropertyValue('rotate')).toBe('')
    }

    const breathingIcon = icons[1]
    expect(breathingIcon?.querySelector('ellipse')).toBeNull()
    expect(breathingIcon?.querySelector('circle')).toBeNull()
    expect(breathingIcon?.querySelectorAll('path')).toHaveLength(3)
  })
})
