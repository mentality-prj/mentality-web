import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import { SafetyResources } from './SafetyResources'

jest.mock('next-intl/server')
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

beforeEach(() => {
  jest.clearAllMocks()
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => key)
})

describe('P0 unconditional urgent help and diary privacy', () => {
  it('shows immediate emergency contact on My Day without expanding a panel', async () => {
    render(await SafetyResources())

    expect(screen.getByRole('complementary', { name: 'label' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'emergencySummary' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'phoneAction' })).toHaveAttribute('href', 'tel:112')
    expect(screen.getByText('phoneCoverage')).toBeVisible()
    expect(screen.getByText('limitation')).toBeVisible()
    expect(screen.queryByText('diaryPrivacy')).not.toBeInTheDocument()
    expect(screen.queryByRole('group')).not.toBeInTheDocument()
  })

  it('displays an actual privacy-policy link before diary entry, without relying on records', async () => {
    render(await SafetyResources({ showDiaryPrivacy: true }))

    expect(screen.getByText('diaryPrivacy')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'privacyLink' })).toHaveAttribute('href', '/privacy')
    expect(screen.getByRole('link', { name: 'phoneAction' })).toHaveAttribute('href', 'tel:112')
    expect(screen.getByText('otherSupport')).toBeInTheDocument()
  })
})
