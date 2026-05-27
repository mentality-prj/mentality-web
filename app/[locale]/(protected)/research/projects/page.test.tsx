import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import ResearchProjectsPage from '@/app/[locale]/(protected)/research/projects/page'
import { getServerSession } from '@/lib/auth/server'
import { getResearchProjects, getResearchWorkspaceAccess } from '@/requests/researchProjects'
import { CustomSession } from '@/types/auth'

jest.mock('next-intl/server')
jest.mock('@/lib/auth/server', () => ({ getServerSession: jest.fn() }))
jest.mock('@/requests/researchProjects', () => ({
  getResearchProjects: jest.fn(),
  getResearchWorkspaceAccess: jest.fn(),
}))

jest.mock('@/components/features/Research/ResearchProjectsList', () => ({
  ResearchProjectsList: ({ projects }: { projects: Array<{ id: string }> }) => (
    <div data-testid="research-projects-list">projects:{projects.length}</div>
  ),
}))

jest.mock('@/components/features/Research/ResearchStateCard', () => ({
  ResearchStateCard: ({ title, description }: { title: string; description: string }) => (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
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
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => {
    switch (key) {
      case 'projects.title':
        return 'Research projects'
      case 'projects.subtitle':
        return 'Projects in your membership scope'
      case 'projects.unavailableTitle':
        return 'Research projects unavailable'
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
  ;(getResearchWorkspaceAccess as jest.Mock).mockResolvedValue({
    data: {
      hasAccess: true,
      canCreateProjects: false,
      capabilities: ['scientist'],
      companies: [],
      scientists: [],
    },
  })
})

describe('Research projects page', () => {
  it('renders the access denied state when the workspace itself is unavailable', async () => {
    ;(getResearchWorkspaceAccess as jest.Mock).mockResolvedValue({
      data: {
        hasAccess: false,
        canCreateProjects: false,
        capabilities: [],
        companies: [],
        scientists: [],
      },
    })

    render(await ResearchProjectsPage())

    expect(screen.getByRole('heading', { name: 'Access denied' })).toBeInTheDocument()
    expect(screen.getByText('Research workspace access is restricted.')).toBeInTheDocument()
    expect(getResearchProjects).not.toHaveBeenCalled()
  })

  it('renders the unavailable state when the request fails', async () => {
    ;(getResearchProjects as jest.Mock).mockResolvedValue({ error: 'Forbidden', status: 403 })

    render(await ResearchProjectsPage())

    expect(screen.getByRole('heading', { name: 'Research projects unavailable' })).toBeInTheDocument()
    expect(screen.getByText('Forbidden')).toBeInTheDocument()
  })

  it('renders the localized workspace error when access discovery fails', async () => {
    ;(getResearchWorkspaceAccess as jest.Mock).mockResolvedValue({
      error: 'Company boundary для research layer не визначено',
      status: 403,
    })

    render(await ResearchProjectsPage())

    expect(screen.getByRole('heading', { name: 'Research workspace unavailable' })).toBeInTheDocument()
    expect(screen.getByText('Company boundary is not defined for the research workspace.')).toBeInTheDocument()
    expect(getResearchProjects).not.toHaveBeenCalled()
  })

  it('renders page copy and forwards projects to the list component', async () => {
    ;(getResearchProjects as jest.Mock).mockResolvedValue({
      data: [
        {
          id: 'project-1',
          name: 'Sleep Resilience',
        },
      ],
    })

    render(await ResearchProjectsPage())

    expect(getResearchWorkspaceAccess).toHaveBeenCalledWith(mockSession)
    expect(getResearchProjects).toHaveBeenCalledWith(mockSession)
    expect(screen.getByRole('heading', { name: 'Research projects' })).toBeInTheDocument()
    expect(screen.getByText('Projects in your membership scope')).toBeInTheDocument()
    expect(screen.getByTestId('research-projects-list')).toHaveTextContent('projects:1')
  })
})
