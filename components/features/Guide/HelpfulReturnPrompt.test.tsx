import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import { HelpfulReturnPrompt } from '@/components/features/Guide/HelpfulReturnPrompt'
import { getServerSession } from '@/lib/get-server-session'
import { getExerciseFeedback } from '@/requests/exerciseFeedback'

jest.mock('next-intl/server')
jest.mock('@/lib/get-server-session', () => ({ getServerSession: jest.fn() }))
jest.mock('@/requests/exerciseFeedback', () => ({ getExerciseFeedback: jest.fn() }))
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

beforeEach(() => {
  jest.clearAllMocks()
  ;(getServerSession as jest.Mock).mockResolvedValue({ user: { id: 'current-user' } })
  ;(getTranslations as jest.Mock).mockResolvedValue(
    (key: string, values?: { category: string }) => values ? `${key}:${values.category}` : key
  )
})

describe('HelpfulReturnPrompt', () => {
  it('offers a previously explicitly helpful exercise, without a new mood check-in', async () => {
    ;(getExerciseFeedback as jest.Mock).mockResolvedValue({
      data: [
        { category: 'focus', helpful: false },
        { category: 'calming', helpful: true },
      ],
    })

    render(await HelpfulReturnPrompt())

    expect(getExerciseFeedback).toHaveBeenCalledWith({ user: { id: 'current-user' } })
    expect(screen.getByText('prompt:categories.calming')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'open' })).toHaveAttribute('href', '/guide/calming')
    expect(screen.queryByText('categories.focus')).not.toBeInTheDocument()
  })

  it('does not infer an option from only negative or missing votes', async () => {
    ;(getExerciseFeedback as jest.Mock).mockResolvedValue({
      data: [{ category: 'breathing', helpful: false }],
    })
    const { container } = render(await HelpfulReturnPrompt())
    expect(container).toBeEmptyDOMElement()
  })

  it('renders no invented user preference when feedback is unavailable', async () => {
    ;(getExerciseFeedback as jest.Mock).mockResolvedValue({ error: 'Unavailable', status: 503 })
    const { container } = render(await HelpfulReturnPrompt())
    expect(container).toBeEmptyDOMElement()
    expect(getTranslations).not.toHaveBeenCalled()
  })
})
