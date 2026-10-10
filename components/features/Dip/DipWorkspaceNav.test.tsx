import { render, screen } from '@testing-library/react'

import { DipWorkspaceNav } from '@/components/features/Dip/DipWorkspaceNav'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    switch (key) {
      case 'nav.research':
        return 'Research'
      case 'nav.data':
        return 'Data'
      case 'nav.models':
        return 'Models'
      case 'nav.decisions':
        return 'Decisions'
      case 'nav.system':
        return 'System'
      default:
        return key
    }
  },
}))

jest.mock('next/navigation', () => ({
  usePathname: () => '/en/admin/dip/data',
  useSearchParams: () => new URLSearchParams('org=org-123'),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

describe('DipWorkspaceNav', () => {
  it('preserves selected org across workspace tabs', () => {
    render(<DipWorkspaceNav locale="en" />)

    expect(screen.getByRole('link', { name: 'Research' })).toHaveAttribute('href', '/en/admin/dip/research?org=org-123')
    expect(screen.getByRole('link', { name: 'Data' })).toHaveAttribute('href', '/en/admin/dip/data?org=org-123')
    expect(screen.getByRole('link', { name: 'System' })).toHaveAttribute('href', '/en/admin/dip/system?org=org-123')
  })
})
