import { fireEvent, render, screen } from '@testing-library/react'

import { HoverCard } from '@/components/shared/Cards/HoverCard/HoverCard'

// mock Link to be simple anchor
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children?: React.ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}))

describe('HoverCard', () => {
  it('toggles card type on mouse enter/leave', () => {
    render(<HoverCard href="/foo" icon="zap" title="My title" description="desc" />)

    const link = screen.getByRole('link')
    const card = link.firstChild as HTMLElement
    expect(card).toBeInTheDocument()
    // initial type is default (class should include 'default')
    expect(card).toHaveClass('default')

    fireEvent.mouseEnter(card)
    expect(card).toHaveClass('success')

    fireEvent.mouseLeave(card)
    expect(card).toHaveClass('default')
  })

  it('accepts a ReactNode icon', () => {
    const Icon: React.FC = () => <span data-testid="icon" />
    render(<HoverCard href="/foo" icon={<Icon />} title="X" description="Y" />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })
})
