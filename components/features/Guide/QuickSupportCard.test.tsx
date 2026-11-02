import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import { QuickSupportCard } from './QuickSupportCard'

jest.mock('next-intl/server')
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))
jest.mock('@/ds/components/SectionCard', () => ({
  SectionCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

beforeEach(() => {
  jest.clearAllMocks()
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => key)
})

describe('QuickSupportCard', () => {
  it('offers a useful grounding prompt without a remote API or prior mood check-in', async () => {
    render(await QuickSupportCard())

    expect(getTranslations).toHaveBeenCalledWith('components.ExercisesForRecovery.quickSupport')
    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument()
    expect(screen.getByText('groundingPrompt')).toBeInTheDocument()
    expect(screen.getByText('optionalNote')).toBeInTheDocument()
  })

  it('links directly to the existing breathing and calming Guide pages', async () => {
    render(await QuickSupportCard())

    expect(screen.getByRole('link', { name: 'breathingAction' })).toHaveAttribute('href', '/guide/breathing')
    expect(screen.getByRole('link', { name: 'calmingAction' })).toHaveAttribute('href', '/guide/calming')
  })
})
