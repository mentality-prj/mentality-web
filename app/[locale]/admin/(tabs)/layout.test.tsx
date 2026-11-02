import { render, screen } from '@testing-library/react'

import AdminTabsLayout from '@/app/[locale]/admin/(tabs)/layout'

jest.mock('@/components/features/Admin/AdminInnerMenu/AdminInnerMenu', () => ({
  __esModule: true,
  default: () => <nav aria-label="Admin sections">Dashboard sections</nav>,
}))
jest.mock('@/components/Layout/MobileNavDrawer/AdminMobileNavDrawer', () => ({
  __esModule: true,
  default: () => <span>Duplicate mobile drawer</span>,
}))

describe('Admin tabs mobile navigation', () => {
  it('keeps only the tabs selector; global admin layout owns the single navigation drawer', () => {
    render(<AdminTabsLayout>Dashboard content</AdminTabsLayout>)

    expect(screen.getByRole('navigation', { name: 'Admin sections' })).toBeInTheDocument()
    expect(screen.getByText('Dashboard content')).toBeInTheDocument()
    expect(screen.queryByText('Duplicate mobile drawer')).not.toBeInTheDocument()
  })
})
