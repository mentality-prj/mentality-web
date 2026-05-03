import { render, screen } from '@testing-library/react'

import { StaticCard } from '@/components/shared/Cards/StaticCard'

describe('StaticCard', () => {
  it('renders children and default card classes', () => {
    render(
      <StaticCard>
        <span>Static content</span>
      </StaticCard>
    )

    const child = screen.getByText('Static content')
    const card = child.closest('div')

    expect(card).toHaveClass('rounded-2xl')
    expect(card).toHaveClass('bg-white')
    expect(card).toHaveClass('p-6')
  })

  it('merges custom className', () => {
    render(
      <StaticCard className="custom-class">
        <span>Custom class content</span>
      </StaticCard>
    )

    const child = screen.getByText('Custom class content')
    const card = child.closest('div')

    expect(card).toHaveClass('custom-class')
  })
})
