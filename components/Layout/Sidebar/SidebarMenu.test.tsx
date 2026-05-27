import { render, screen } from '@testing-library/react'

import SidebarMenu from '@/components/Layout/Sidebar/SidebarMenu'
import { usePathname } from '@/i18n/navigation'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('@/helpers/side-menu.helpers', () => ({
  getMenuItemClass: (active: boolean) => (active ? 'active-item' : 'inactive-item'),
}))

jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
  usePathname: jest.fn(),
}))

describe('SidebarMenu', () => {
  it('activates only the most specific matching menu item', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/research/projects/create')

    render(
      <SidebarMenu
        menu={[
          { key: 'research-projects', href: '/research/projects', icon: 'folderTree' },
          { key: 'research-create-project', href: '/research/projects/create', icon: 'notebookPen' },
        ]}
      />
    )

    expect(screen.getByRole('link', { name: 'research-projects' })).toHaveClass('inactive-item')
    expect(screen.getByRole('link', { name: 'research-create-project' })).toHaveClass('active-item')
  })

  it('keeps the parent menu item active for deeper descendant routes', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/research/projects/project-1')

    render(
      <SidebarMenu
        menu={[
          { key: 'research-projects', href: '/research/projects', icon: 'folderTree' },
          { key: 'research-create-project', href: '/research/projects/create', icon: 'notebookPen' },
        ]}
      />
    )

    expect(screen.getByRole('link', { name: 'research-projects' })).toHaveClass('active-item')
    expect(screen.getByRole('link', { name: 'research-create-project' })).toHaveClass('inactive-item')
  })
})
