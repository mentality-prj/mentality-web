import { render, screen } from '@testing-library/react'

import { ResearchInnerMenu } from '@/components/features/Admin/Research/ResearchInnerMenu'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('@/components/shared/InnerMenu', () => ({
  InnerMenu: ({ items }: { items: Array<{ label: string }> }) => (
    <nav>{items.map((item) => item.label).join(', ')}</nav>
  ),
}))

describe('ResearchInnerMenu', () => {
  it('does not render a menu when only one destination is available', () => {
    const { container } = render(<ResearchInnerMenu />)

    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })
})
