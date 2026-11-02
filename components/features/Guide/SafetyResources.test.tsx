import { fireEvent, render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import { SafetyResources } from '@/components/features/Guide/SafetyResources'
import { Routes } from '@/constants/routes'

jest.mock('next-intl/server')
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

beforeEach(() => {
  jest.clearAllMocks()
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => key)
})

describe('SafetyResources', () => {
  it('does not require a mood score or diary submission for human emergency help', async () => {
    render(await SafetyResources({}))

    fireEvent.click(screen.getByText('emergencySummary'))
    expect(screen.getByRole('link', { name: 'phoneAction' })).toHaveAttribute('href', 'tel:112')
    expect(screen.queryByText('diaryPrivacy')).not.toBeInTheDocument()
  })

  it('shows sensitive-data guidance and a genuine privacy policy link before diary entry', async () => {
    render(await SafetyResources({ showDiaryPrivacy: true }))

    expect(screen.getByText('diaryPrivacy')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'privacyLink' })).toHaveAttribute('href', Routes.PRIVACY)
    fireEvent.click(screen.getByText('emergencySummary'))
    expect(screen.getByText('limitation')).toBeInTheDocument()
  })
})
