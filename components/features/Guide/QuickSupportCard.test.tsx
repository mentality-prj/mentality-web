import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import { HelpfulReturnPrompt } from '@/components/features/Guide/HelpfulReturnPrompt'
import { QuickSupportCard } from '@/components/features/Guide/QuickSupportCard'

jest.mock('next-intl/server')
jest.mock('@/components/features/Guide/HelpfulReturnPrompt', () => ({
  HelpfulReturnPrompt: jest.fn(() => <span data-testid="return-to-helpful">optional return</span>),
}))
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
  it('keeps immediate support accessible without any feedback lookup on other pages', async () => {
    render(await QuickSupportCard())
    expect(screen.getByText('groundingPrompt')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'breathingAction' })).toHaveAttribute('href', '/guide/breathing')
    expect(screen.getByRole('link', { name: 'calmingAction' })).toHaveAttribute('href', '/guide/calming')
    expect(HelpfulReturnPrompt).not.toHaveBeenCalled()
  })

  it('adds the optional return path for My Day without hiding quick support', async () => {
    render(await QuickSupportCard({ showHelpfulReturn: true }))
    expect(screen.getByText('groundingPrompt')).toBeInTheDocument()
    expect(screen.getByTestId('return-to-helpful')).toBeInTheDocument()
    expect(screen.getByText('optionalNote')).toBeInTheDocument()
  })
})
