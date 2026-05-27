import { render, screen } from '@testing-library/react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import ResearchProjectLayout from '@/app/[locale]/(protected)/research/projects/[projectId]/layout'
import { getServerSession } from '@/lib/auth/server'
import { getEmployees, getEmployeesAdmin } from '@/requests/employees'
import { getResearchProjectById } from '@/requests/researchProjects'
import { CustomSession } from '@/types/auth'

jest.mock('next-intl/server')
jest.mock('next/navigation', () => ({ notFound: jest.fn() }))
jest.mock('@/lib/auth/server', () => ({ getServerSession: jest.fn() }))
jest.mock('@/requests/employees', () => ({ getEmployees: jest.fn(), getEmployeesAdmin: jest.fn() }))
jest.mock('@/requests/researchProjects', () => ({ getResearchProjectById: jest.fn() }))

jest.mock('@/components/features/Research/ResearchProjectInnerMenu', () => ({
  ResearchProjectInnerMenu: ({ projectId }: { projectId: string }) => (
    <div data-testid="research-project-inner-menu">project:{projectId}</div>
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

jest.mock('@/components/shared/Cards/StaticCard', () => ({
  StaticCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}))

const mockSession: CustomSession = {
  user: { id: 'user-1', name: 'Research User', email: 'research.user@example.com', role: 'user' },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
}

beforeEach(() => {
  jest.clearAllMocks()
  ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
  ;(getEmployees as jest.Mock).mockResolvedValue({ data: { total: 0, items: [] } })
  ;(getEmployeesAdmin as jest.Mock).mockResolvedValue({ data: { total: 0, items: [] } })
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => {
    switch (key) {
      case 'workspace.accessDeniedTitle':
        return 'Access denied'
      case 'workspace.accessDeniedDescription':
        return 'Research workspace access is restricted.'
      case 'common.notAvailable':
        return 'Not available'
      case 'project.noDescription':
        return 'No description provided.'
      case 'panels.overview.metadataTitle':
        return 'Project metadata'
      case 'labels.company':
        return 'Company'
      case 'labels.status':
        return 'Status'
      case 'labels.approvalStatus':
        return 'Approval'
      case 'labels.exportPolicy':
        return 'Export'
      case 'labels.pseudonymizationMode':
        return 'Pseudonymization'
      case 'labels.principalInvestigator':
        return 'PI'
      case 'statuses.project.draft':
        return 'Draft'
      case 'statuses.project.active':
        return 'Active'
      case 'statuses.project.paused':
        return 'Paused'
      case 'statuses.project.completed':
        return 'Completed'
      case 'statuses.project.archived':
        return 'Archived'
      case 'options.approvalStatus.pending':
        return 'Pending'
      case 'options.approvalStatus.draft':
        return 'Draft approval'
      case 'options.approvalStatus.pending_review':
        return 'Pending review'
      case 'options.approvalStatus.approved':
        return 'Approved'
      case 'options.approvalStatus.rejected':
        return 'Rejected'
      case 'options.exportPolicy.blocked':
        return 'Blocked'
      case 'options.exportPolicy.review_required':
        return 'Review required'
      case 'options.exportPolicy.allowed':
        return 'Allowed'
      case 'options.exportPolicy.inline_ready':
        return 'Inline ready'
      case 'options.exportPolicy.disabled':
        return 'Disabled'
      case 'options.pseudonymizationMode.required':
        return 'Required'
      case 'options.pseudonymizationMode.optional':
        return 'Optional'
      case 'options.pseudonymizationMode.none':
        return 'None'
      case 'options.pseudonymizationMode.pseudonymous':
        return 'Pseudonymous'
      case 'options.pseudonymizationMode.aggregated':
        return 'Aggregated'
      case 'options.pseudonymizationMode.raw_granted':
        return 'Raw granted'
      default:
        return key
    }
  })
})

describe('Research project layout', () => {
  it('renders the denied state for 403 responses', async () => {
    ;(getResearchProjectById as jest.Mock).mockResolvedValue({ error: 'Forbidden', status: 403 })

    render(
      await ResearchProjectLayout({
        children: <div>Project content</div>,
        params: Promise.resolve({ projectId: 'project-1' }),
      })
    )

    expect(screen.getByRole('heading', { name: 'Access denied' })).toBeInTheDocument()
    expect(screen.getByText('Research workspace access is restricted.')).toBeInTheDocument()
    expect(screen.queryByText('Project content')).not.toBeInTheDocument()
  })

  it('delegates non-403 failures to notFound', async () => {
    ;(getResearchProjectById as jest.Mock).mockResolvedValue({ error: 'Missing', status: 404 })
    ;(notFound as unknown as jest.Mock).mockImplementation(() => {
      throw new Error('NEXT_NOT_FOUND')
    })

    await expect(
      ResearchProjectLayout({
        children: <div>Project content</div>,
        params: Promise.resolve({ projectId: 'project-1' }),
      })
    ).rejects.toThrow('NEXT_NOT_FOUND')

    expect(notFound as unknown as jest.Mock).toHaveBeenCalled()
  })

  it('renders menu, children and fallback badge values for unknown project metadata', async () => {
    ;(getResearchProjectById as jest.Mock).mockResolvedValue({
      data: {
        id: 'project-1',
        name: 'Sleep Resilience',
        description: '',
        objective: '',
        status: 'under_review',
        approvalStatus: 'board_pending',
        exportPolicy: 'manual_gate',
        pseudonymizationMode: 'masked',
        principalInvestigatorId: '',
        companyName: '',
      },
    })

    render(
      await ResearchProjectLayout({
        children: <div>Project content</div>,
        params: Promise.resolve({ projectId: 'project-1' }),
      })
    )

    expect(getResearchProjectById).toHaveBeenCalledWith(mockSession, 'project-1')
    expect(screen.getByRole('heading', { name: 'Sleep Resilience' })).toBeInTheDocument()
    expect(screen.getByText('No description provided.')).toBeInTheDocument()
    expect(screen.getByText('project:project-1')).toBeInTheDocument()
    expect(screen.getByText('Company')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Approval')).toBeInTheDocument()
    expect(screen.getByText('Export')).toBeInTheDocument()
    expect(screen.getByText('Pseudonymization')).toBeInTheDocument()
    expect(screen.getByText('under_review')).toBeInTheDocument()
    expect(screen.getByText('board_pending')).toBeInTheDocument()
    expect(screen.getByText('manual_gate')).toBeInTheDocument()
    expect(screen.getByText('masked')).toBeInTheDocument()
    expect(screen.getAllByText('Not available').length).toBeGreaterThan(0)
    expect(screen.getByText('Project content')).toBeInTheDocument()
  })

  it('renders translated current enums and uses the PI display name instead of the raw id', async () => {
    ;(getResearchProjectById as jest.Mock).mockResolvedValue({
      data: {
        id: 'project-2',
        name: 'Burnout Signal',
        description: 'Longitudinal observation.',
        objective: '',
        status: 'active',
        approvalStatus: 'pending_review',
        exportPolicy: 'allowed',
        pseudonymizationMode: 'required',
        principalInvestigatorId: 'scientist-1',
        companyId: 'company-1',
        companyName: 'Acme Research',
        members: [
          {
            userId: 'scientist-1',
            name: 'Nadia Koval',
          },
        ],
      },
    })

    render(
      await ResearchProjectLayout({
        children: <div>Project content</div>,
        params: Promise.resolve({ projectId: 'project-2' }),
      })
    )

    expect(screen.getByText('Company')).toBeInTheDocument()
    expect(screen.getByText('Acme Research')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Pending review')).toBeInTheDocument()
    expect(screen.getByText('Allowed')).toBeInTheDocument()
    expect(screen.getByText('Required')).toBeInTheDocument()
    expect(screen.getByText('Nadia Koval')).toBeInTheDocument()
    expect(screen.queryByText('scientist-1')).not.toBeInTheDocument()
  })

  it('renders project metadata collapsed by default', async () => {
    ;(getResearchProjectById as jest.Mock).mockResolvedValue({
      data: {
        id: 'project-3',
        name: 'Adaptive Intervention',
        description: 'Pilot cohort program.',
        objective: '',
        status: 'active',
        approvalStatus: 'approved',
        exportPolicy: 'review_required',
        pseudonymizationMode: 'required',
        principalInvestigatorId: '',
        companyName: 'Acme Research',
      },
    })

    render(
      await ResearchProjectLayout({
        children: <div>Project content</div>,
        params: Promise.resolve({ projectId: 'project-3' }),
      })
    )

    const detailsElement = screen.getByText('Project metadata').closest('details')

    expect(detailsElement).not.toHaveAttribute('open')
  })
})
