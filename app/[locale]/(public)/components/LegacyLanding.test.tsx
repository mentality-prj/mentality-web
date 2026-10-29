import { render, screen } from '@testing-library/react'

import { LegacyFeatureCardsSection } from './LegacyFeatureCardsSection'

jest.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => namespace + '.' + key,
}))

describe('restored original landing design', () => {
  it('renders the three illustrated feature cards', () => {
    render(<LegacyFeatureCardsSection />)
    expect(screen.getByText('pages.Landing.Features.interactivity.title')).toBeInTheDocument()
    expect(screen.getByText('pages.Landing.Features.support.title')).toBeInTheDocument()
    expect(screen.getByText('pages.Landing.Features.ai.title')).toBeInTheDocument()
  })
})
