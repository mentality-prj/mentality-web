import { render, screen } from '@testing-library/react'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

import MentalGamesLayout from '@/app/[locale]/(protected)/mental-games/layout'
import MentalGamesPage from '@/app/[locale]/(protected)/mental-games/page'

// replace i18n Link with plain anchor to avoid intl context in tests
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children?: React.ReactNode }) => (
    <a {...props}>{children}</a>
  ),
  usePathname: () => '/mental-games',
}))

jest.mock('next-intl/server')
jest.mock('next-intl')

describe('MentalGames page', () => {
  beforeEach(() => {
    ;(useTranslations as jest.Mock).mockReturnValue((key: string) => {
      const translations: Record<string, string> = {
        title: 'Mental Games',
        subtitle: 'Subtitle',
        'attentionSprint.title': 'Attention Sprint',
        'attentionSprint.description': 'Desc',
      }

      return translations[key] ?? key
    })
    ;(getTranslations as jest.Mock).mockResolvedValue((key: string, vars?: any) => {
      type TransObj = { [key: string]: string | TransObj }
      const translations: TransObj = {
        title: 'Mental Games',
        subtitle: 'Subtitle',
        attentionSprint: {
          title: 'Attention Sprint',
          description: 'Desc',
          subtitle: '5 min',
        },
      }
      // support nested key lookup
      return (
        (key
          .split('.')
          .reduce<unknown>((obj, k) => (obj && typeof obj === 'object' ? (obj as any)[k] : undefined), translations) as
          | string
          | undefined) ?? key
      )
    })
  })

  it('renders link to attention sprint', async () => {
    const pageElement = await MentalGamesPage()
    render(pageElement as React.ReactElement)

    const link = screen.getByRole('link')
    expect(screen.getByText('«Attention Sprint»')).toBeInTheDocument()
    expect(screen.getByText('Desc')).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/attention-sprint')
  })

  it('layout shows title and children', async () => {
    const layoutElement = await MentalGamesLayout({ children: <div>child</div> })
    render(layoutElement as React.ReactElement)

    expect(screen.getByRole('heading', { level: 1, name: 'Mental Games' })).toBeInTheDocument()
    expect(screen.getByText('child')).toBeInTheDocument()
  })
})
