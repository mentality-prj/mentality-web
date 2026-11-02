import { render, screen } from '@testing-library/react'
import { getLocale } from 'next-intl/server'

import Loading from './loading'

jest.mock('next-intl/server', () => ({ getLocale: jest.fn() }))

describe('authenticated route loading boundary', () => {
  it.each([
    ['uk', 'Завантаження сторінки'],
    ['pl', 'Wczytywanie strony'],
    ['en', 'Loading your page'],
  ])('shows a meaningful loading status in %s', async (locale, title) => {
    ;(getLocale as jest.Mock).mockResolvedValue(locale)
    const { container } = render(await Loading())

    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(status).toHaveAttribute('data-protected-route-loading')
    expect(screen.getByText(title)).toBeInTheDocument()
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(0)
    expect(container.querySelectorAll('.rounded-xl')).toHaveLength(0)
  })

  it('uses the English status as a safe fallback for unsupported locales', async () => {
    ;(getLocale as jest.Mock).mockResolvedValue('unknown')
    render(await Loading())
    expect(screen.getByText('Loading your page')).toBeInTheDocument()
  })
})
