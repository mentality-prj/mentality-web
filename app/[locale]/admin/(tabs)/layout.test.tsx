import { render, screen } from '@testing-library/react'

import AdminTabsLayout from '@/app/[locale]/admin/(tabs)/layout'

jest.mock('@/components/features/Admin/AdminInnerMenu/AdminInnerMenu', () => ({
  __esModule: true,
  default: () => <nav aria-label="Admin sections">Dashboard sections</nav>,
}))
jest.mock('@/components/Layout/MobileNavDrawer/AdminMobileNavDrawer', () => ({
  __esModule: true,
  default: () => <button type="button" aria-label="Open admin navigation">Menu</button>,
}))

describe('Admin tabs mobile navigation', () => {
  it('keeps only the tabs selector; global admin layout owns the single navigation drawer', () => {
    render(
      <AdminTabsLayout>
        <div>Dashboard content</div>
      </AdminTabsLayout>
    )

    expect(screen.getByRole('navigation', { name: 'Admin sections' })).toBeInTheDocument()
    expect(screen.getByText('Dashboard content')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Open admin navigation' })).not.toBeInTheDocument()
  })
})
