import { render, screen } from '@testing-library/react'

import Card from '@/components/shared/Cards/Card'

jest.mock('@/i18n/navigation', () => ({
  Link: ({
    children,
    href,
    className,
    'aria-label': ariaLabel,
  }: {
    children: React.ReactNode
    href: string
    className?: string
    'aria-label'?: string
  }) => (
    <a href={href} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}))

jest.mock('lucide-react', () => ({
  Calendar: () => <svg data-testid="calendar-icon" />,
  Clock: () => <svg data-testid="clock-icon" />,
  SquareArrowOutUpRight: () => <svg data-testid="square-arrow-icon" />,
}))

describe('Card', () => {
  describe('date prop', () => {
    it('renders date text with Calendar icon when date is provided', () => {
      render(<Card date="12.03.2026" />)

      expect(screen.getByText('12.03.2026')).toBeInTheDocument()
      expect(screen.getByTestId('calendar-icon')).toBeInTheDocument()
    })

    it('does not render Calendar icon when date is not provided', () => {
      render(<Card />)

      expect(screen.queryByTestId('calendar-icon')).not.toBeInTheDocument()
    })
  })

  describe('time prop', () => {
    it('renders time text with Clock icon when time is provided', () => {
      render(<Card time="14:30" />)

      expect(screen.getByText('14:30')).toBeInTheDocument()
      expect(screen.getByTestId('clock-icon')).toBeInTheDocument()
    })

    it('does not render Clock icon when time is not provided', () => {
      render(<Card />)

      expect(screen.queryByTestId('clock-icon')).not.toBeInTheDocument()
    })

    it('can render both date and time simultaneously', () => {
      render(<Card date="12.03.2026" time="14:30" />)

      expect(screen.getByTestId('calendar-icon')).toBeInTheDocument()
      expect(screen.getByTestId('clock-icon')).toBeInTheDocument()
      expect(screen.getByText('12.03.2026')).toBeInTheDocument()
      expect(screen.getByText('14:30')).toBeInTheDocument()
    })
  })

  describe('link prop', () => {
    it('wraps card in an anchor when link is provided', () => {
      render(<Card link="/mood-tracker#records" title="My Card" />)

      const anchor = screen.getByRole('link')
      expect(anchor).toHaveAttribute('href', '/mood-tracker#records')
    })

    it('does not render anchor when link is not provided', () => {
      render(<Card title="No link" />)

      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })

    it('renders card content inside the link', () => {
      render(<Card link="/some-path" title="Card Title" />)

      expect(screen.getByText('Card Title')).toBeInTheDocument()
      const anchor = screen.getByRole('link')
      expect(anchor).toHaveAttribute('aria-label', 'Card Title')
    })
  })

  describe('general rendering', () => {
    it('renders title and subtitle', () => {
      render(<Card title="Hello" subtitle="World" />)

      expect(screen.getByText('Hello')).toBeInTheDocument()
      expect(screen.getByText('World')).toBeInTheDocument()
    })

    it('renders children', () => {
      render(
        <Card>
          <span data-testid="child">content</span>
        </Card>
      )

      expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('renders tags', () => {
      render(<Card tags={['calm', 'happy']} />)

      expect(screen.getByText('calm')).toBeInTheDocument()
      expect(screen.getByText('happy')).toBeInTheDocument()
    })

    it('renders as button when onClick is provided', () => {
      render(<Card onClick={() => {}} title="Clickable" />)

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('does not render as button when onClick is not provided', () => {
      render(<Card title="Not clickable" />)

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })
})
