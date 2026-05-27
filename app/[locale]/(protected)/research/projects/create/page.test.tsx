import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import ResearchProjectsCreatePage from '@/app/[locale]/(protected)/research/projects/create/page'
import { getServerSession } from '@/lib/auth/server'
import { getResearchWorkspaceAccess } from '@/requests/researchProjects'
import { CustomSession } from '@/types/auth'

jest.mock('next-intl/server')
jest.mock('@/lib/auth/server', () => ({ getServerSession: jest.fn() }))
jest.mock('@/requests/researchProjects', () => ({ getResearchWorkspaceAccess: jest.fn() }))

jest.mock('@/components/features/Research/CreateResearchProjectForm', () => ({
  CreateResearchProjectForm: ({ access }: { access: { canCreateProjects: boolean } }) => (
    <div data-testid="create-research-project-form">can-create:{String(access.canCreateProjects)}</div>
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
      case 'workspace.unavailableTitle':
        return 'Research workspace unavailable'
      case 'workspace.accessDeniedTitle':
        return 'Access denied'
      case 'workspace.accessDeniedDescription':
        return 'Research workspace access is restricted.'
      case 'errors.companyBoundaryNotDefined':
        return 'Company boundary is not defined for the research workspace.'
      case 'create.title':
        return 'Create research project'
      case 'create.subtitle':
        return 'Configure metadata and governed access.'
      default:
        return key
    }
  })
})

describe('Research create page', () => {
  it('renders the localized workspace error when access discovery fails', async () => {
    ;(getResearchWorkspaceAccess as jest.Mock).mockResolvedValue({
      error: 'Company boundary для research layer не визначено',
      status: 403,
    })

    render(await ResearchProjectsCreatePage())

    expect(screen.getByRole('heading', { name: 'Research workspace unavailable' })).toBeInTheDocument()
    expect(screen.getByText('Company boundary is not defined for the research workspace.')).toBeInTheDocument()
    expect(screen.queryByTestId('create-research-project-form')).not.toBeInTheDocument()
  })

  it('renders the create form with access data when workspace access is granted', async () => {
    ;(getResearchWorkspaceAccess as jest.Mock).mockResolvedValue({
      data: {
        hasAccess: true,
        canCreateProjects: true,
        capabilities: ['research_admin'],
        companies: [],
        scientists: [],
      },
    })

    render(await ResearchProjectsCreatePage())

    expect(getResearchWorkspaceAccess).toHaveBeenCalledWith(mockSession)
    expect(screen.getByRole('heading', { name: 'Create research project' })).toBeInTheDocument()
    expect(screen.getByText('Configure metadata and governed access.')).toBeInTheDocument()
    expect(screen.getByTestId('create-research-project-form')).toHaveTextContent('can-create:true')
  })
})
