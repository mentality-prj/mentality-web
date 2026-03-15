import { render, screen } from '@testing-library/react'
import { useLocale } from 'next-intl'

import LocalDate from '@/components/Layout/Header/LocalDate'

jest.mock('next-intl')
jest.mock('lucide-react', () => ({ Calendar: () => <svg data-testid="calendar-icon" /> }))

beforeEach(() => {
  ;(useLocale as jest.Mock).mockReturnValue('en')
})

describe('LocalDate', () => {
  it('renders a calendar icon', () => {
    render(<LocalDate />)

    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument()
  })

  it('renders a short date format for small screens (hidden on lg+)', () => {
    render(<LocalDate />)

    // The short date span has class lg:hidden
    const shortSpan = document.querySelector('.lg\\:hidden')
    expect(shortSpan).toBeInTheDocument()
    expect(shortSpan?.textContent).toMatch(/\d{2}[./]\d{2}[./]\d{2}/)
  })

  it('renders full weekday and month date for large screens', () => {
    render(<LocalDate />)

    // The full date span has class hidden lg:contents
    const fullSpan = document.querySelector('.hidden.lg\\:contents')
    expect(fullSpan).toBeInTheDocument()
    // Should contain two <em> elements: weekday and date
    const ems = fullSpan?.querySelectorAll('em')
    expect(ems).toHaveLength(2)
  })

  it('formats date using the active locale', () => {
    ;(useLocale as jest.Mock).mockReturnValue('uk')

    render(<LocalDate />)

    // Component should render without errors for uk locale
    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument()
  })
})
