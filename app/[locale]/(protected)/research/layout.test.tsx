import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import ResearchLayout from '@/app/[locale]/(protected)/research/layout'
import { getResearchSidebarMenu } from '@/constants/menu'
import { getServerSession } from '@/lib/auth/server'
import { getResearchWorkspaceAccess } from '@/requests/researchProjects'
import { CustomSession } from '@/types/auth'

jest.mock('next-intl/server')
jest.mock('@/lib/auth/server', () => ({ getServerSession: jest.fn() }))
jest.mock('@/constants/menu', () => ({ getResearchSidebarMenu: jest.fn() }))
jest.mock('@/requests/researchProjects', () => ({ getResearchWorkspaceAccess: jest.fn() }))

jest.mock('@/components/features/Landing', () => ({
  LandingFooter: () => <div data-testid="landing-footer" />,
}))

jest.mock('@/components/Layout/Header/CompanyHeader', () => ({
  CompanyHeader: ({ menu }: { menu?: Array<{ key: string }> }) => (
    <div data-testid="company-header">menu:{menu?.map((item) => item.key).join(',') ?? 'none'}</div>
  ),
}))

jest.mock('@/components/Layout/mainVariants', () => ({
  mainVariants: () => '',
}))

jest.mock('@/components/Layout/Sidebar/Sidebar', () => ({
  __esModule: true,
  default: ({ menu }: { menu: Array<{ key: string }> }) => (
    <div data-testid="sidebar">menu:{menu.map((item) => item.key).join(',')}</div>
  ),
}))

jest.mock('@/ds/components/PageTitle', () => ({
  PageTitle: ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div>
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  ),
}))

const mockSession: CustomSession = {
  user: { id: 'user-1', name: 'Research User', email: 'research.user@example.com', role: 'user' },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
}

beforeEach(() => {
  jest.clearAllMocks()
  ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
  ;(getResearchSidebarMenu as jest.Mock).mockImplementation(({ includeCreate }: { includeCreate?: boolean }) =>
    includeCreate
      ? [
          { key: 'research-projects', href: '/research/projects' },
          { key: 'research-create-project', href: '/research/projects/create' },
        ]
      : [{ key: 'research-projects', href: '/research/projects' }]
  )
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => {
    switch (key) {
      case 'header.title':
        return 'Research Workspace'
      case 'header.subtitle':
        return 'Governed diagnostics and projects'
      case 'workspace.unavailableTitle':
        return 'Research workspace unavailable'
      case 'workspace.accessDeniedTitle':
        return 'Access denied'
      case 'workspace.accessDeniedDescription':
        return 'Research workspace access is restricted.'
      case 'errors.companyBoundaryNotDefined':
        return 'Company boundary is not defined for the research workspace.'
      default:
        return key
    }
  })
})

describe('Research layout', () => {
  it('renders the access denied state when the user has no workspace access', async () => {
    ;(getResearchWorkspaceAccess as jest.Mock).mockResolvedValue({
      data: {
        hasAccess: false,
        canCreateProjects: false,
        capabilities: [],
        companies: [],
        scientists: [],
      },
    })

    render(await ResearchLayout({ children: <div>Workspace content</div> }))

    expect(screen.getByRole('heading', { name: 'Research Workspace' })).toBeInTheDocument()
    expect(screen.getByText('Governed diagnostics and projects')).toBeInTheDocument()
    expect(screen.getByText('Access denied')).toBeInTheDocument()
    expect(screen.getByText('Research workspace access is restricted.')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar')).toHaveTextContent('menu:research-projects')
    expect(screen.queryByText('Workspace content')).not.toBeInTheDocument()
  })

  it('renders the workspace menu and children when access is granted', async () => {
    ;(getResearchWorkspaceAccess as jest.Mock).mockResolvedValue({
      data: {
        hasAccess: true,
        canCreateProjects: true,
        capabilities: ['scientist'],
        companies: [],
        scientists: [],
      },
    })

    render(await ResearchLayout({ children: <div>Workspace content</div> }))

    expect(getResearchWorkspaceAccess).toHaveBeenCalledWith(mockSession)
    expect(getResearchSidebarMenu).toHaveBeenCalledWith({ includeCreate: true })
    expect(screen.getByTestId('sidebar')).toHaveTextContent('menu:research-projects,research-create-project')
    expect(screen.getByTestId('company-header')).toHaveTextContent('menu:research-projects,research-create-project')
    expect(screen.getByText('Workspace content')).toBeInTheDocument()
  })

  it('renders the localized workspace error when access discovery fails because company boundary is missing', async () => {
    ;(getResearchWorkspaceAccess as jest.Mock).mockResolvedValue({
      error: 'Company boundary для research layer не визначено',
      status: 403,
    })

    render(await ResearchLayout({ children: <div>Workspace content</div> }))

    expect(screen.getByText('Research workspace unavailable')).toBeInTheDocument()
    expect(screen.getByText('Company boundary is not defined for the research workspace.')).toBeInTheDocument()
    expect(screen.queryByText('Workspace content')).not.toBeInTheDocument()
  })
})
