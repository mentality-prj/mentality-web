import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'

import { List } from '@/app/[locale]/(public)/components/List'

describe('List', () => {
  it('renders all items and calls keyExtractor for each item', () => {
    const items = ['First item', 'Second item', 'Third item']
    const keyExtractor = jest.fn((item: ReactNode, index: number) => `${String(item)}-${index}`)

    render(<List items={items} keyExtractor={keyExtractor} />)

    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByText('First item')).toBeInTheDocument()
    expect(screen.getByText('Second item')).toBeInTheDocument()
    expect(screen.getByText('Third item')).toBeInTheDocument()

    expect(keyExtractor).toHaveBeenCalledTimes(3)
    expect(keyExtractor).toHaveBeenNthCalledWith(1, 'First item', 0)
    expect(keyExtractor).toHaveBeenNthCalledWith(2, 'Second item', 1)
    expect(keyExtractor).toHaveBeenNthCalledWith(3, 'Third item', 2)
  })

  it('marks number badges as decorative for screen readers', () => {
    const items = ['Only item']

    render(<List items={items} keyExtractor={(item, index) => `${item}-${index}`} />)

    const badge = screen.getByText('1')
    expect(badge).toHaveAttribute('aria-hidden', 'true')
  })
})
