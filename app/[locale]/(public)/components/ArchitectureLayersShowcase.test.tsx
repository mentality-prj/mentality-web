import { fireEvent, render, screen } from '@testing-library/react'

import { ArchitectureLayersShowcase } from '@/app/[locale]/(public)/components/ArchitectureLayersShowcase'

import { SupportedLanguage } from '../../../../types/languages'

const translations: Record<string, string> = {
  'Architecture.overviewTitle': 'Three layers work as one loop',
  'Architecture.overviewDescriptionLead': 'Lead description.',
  'Architecture.overviewDescriptionFollowup': 'Followup description.',
  'Architecture.interactionHint': 'Select a layer',
  'Architecture.nextAction': 'Next layer',
  'Architecture.core.title': 'Predictive core',
  'Architecture.core.description': 'Core layer description.',
  'Architecture.b2c.title': 'User layer',
  'Architecture.b2c.description': 'B2C layer description.',
  'Architecture.loop.title': 'Prediction → outcome loop',
  'Architecture.loop.description': 'Loop layer description.',
}

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => translations[key as SupportedLanguage] ?? key,
}))

describe('ArchitectureLayersShowcase', () => {
  it('renders with the first layer active by default', () => {
    render(<ArchitectureLayersShowcase />)

    const coreButton = screen.getByRole('button', { name: 'Predictive core, Next layer' })
    expect(coreButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('clicking a chip activates the corresponding layer', () => {
    render(<ArchitectureLayersShowcase />)

    // Chips come before cards in DOM order; [0] is the chip
    const b2cChip = screen.getAllByRole('button', { name: 'User layer' })[0]
    fireEvent.click(b2cChip)

    const b2cCard = screen.getByRole('button', { name: 'User layer, Next layer' })
    expect(b2cCard).toHaveAttribute('aria-pressed', 'true')
  })

  it('clicking an inactive card activates it', () => {
    render(<ArchitectureLayersShowcase />)

    // Cards come after chips in DOM order; [1] is the card
    const loopCard = screen.getAllByRole('button', { name: 'Prediction → outcome loop' })[1]
    fireEvent.click(loopCard)

    const activeLoopCard = screen.getByRole('button', { name: 'Prediction → outcome loop, Next layer' })
    expect(activeLoopCard).toHaveAttribute('aria-pressed', 'true')
  })

  it('clicking the active card cycles to the next layer', () => {
    render(<ArchitectureLayersShowcase />)

    // core is active by default; clicking it should advance to b2c
    const activeCoreCard = screen.getByRole('button', { name: 'Predictive core, Next layer' })
    fireEvent.click(activeCoreCard)

    const activeB2cCard = screen.getByRole('button', { name: 'User layer, Next layer' })
    expect(activeB2cCard).toHaveAttribute('aria-pressed', 'true')
  })

  it('collapsed layer descriptions have aria-hidden', () => {
    render(<ArchitectureLayersShowcase />)

    // Only the active card's description is visible; the other two must be aria-hidden
    const allDescriptions = [
      screen.getByText('Core layer description.'),
      screen.getByText('B2C layer description.'),
      screen.getByText('Loop layer description.'),
    ]

    const hiddenDescriptions = allDescriptions.filter((el) => el.getAttribute('aria-hidden') === 'true')
    const visibleDescriptions = allDescriptions.filter((el) => el.getAttribute('aria-hidden') !== 'true')

    expect(hiddenDescriptions).toHaveLength(2)
    expect(visibleDescriptions).toHaveLength(1)
  })
})
