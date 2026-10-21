import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import { HelpfulExercisesSummary } from '@/components/features/MyProgress/HelpfulExercisesSummary'

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

describe('My Progress personal activity feedback', () => {
  it('shows only the explicitly saved ratings and links back to the matching activities', async () => {
    render(
      await HelpfulExercisesSummary({
        feedback: [
          { category: 'meditation', helpful: true },
          { category: 'focus', helpful: false },
        ],
        failed: false,
      })
    )

    expect(getTranslations).toHaveBeenCalledWith('pages.MyProgress.exercises')
    expect(screen.getByRole('heading', { name: 'heading' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'categories.meditation' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'categories.focus' })).toBeInTheDocument()
    expect(screen.getByText('helpful')).toBeInTheDocument()
    expect(screen.getByText('notHelpful')).toBeInTheDocument()
    const links = screen.getAllByRole('link', { name: 'changeAction' })
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute('href', '/guide/meditations')
    expect(links[1]).toHaveAttribute('href', '/mental-games/attention-sprint')
    expect(screen.queryByText('categories.breathing')).not.toBeInTheDocument()
    expect(screen.getByText('limitNote')).toBeInTheDocument()
  })

  it('does not interpret missing feedback as an explicitly negative result', async () => {
    render(await HelpfulExercisesSummary({ feedback: [], failed: false }))
    expect(screen.getByText('empty')).toBeInTheDocument()
    expect(screen.queryByText('notHelpful')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'browseAction' })).toHaveAttribute('href', '/guide/breathing')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('distinguishes an unavailable backend from empty or saved feedback', async () => {
    render(await HelpfulExercisesSummary({ feedback: [], failed: true }))
    expect(screen.getByRole('alert')).toHaveTextContent('loadError')
    expect(screen.queryByText('empty')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'browseAction' })).not.toBeInTheDocument()
    expect(screen.queryByText('helpful')).not.toBeInTheDocument()
  })

  it('renders the four existing activity routes without adding IDs or new APIs', async () => {
    render(
      await HelpfulExercisesSummary({
        feedback: [
          { category: 'breathing', helpful: true },
          { category: 'calming', helpful: true },
          { category: 'meditation', helpful: false },
          { category: 'focus', helpful: false },
        ],
        failed: false,
      })
    )
    expect(screen.getAllByRole('link', { name: 'changeAction' }).map((link) => link.getAttribute('href'))).toEqual([
      '/guide/breathing',
      '/guide/calming',
      '/guide/meditations',
      '/mental-games/attention-sprint',
    ])
  })
})
