import { render, screen } from '@testing-library/react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import ResearchProjectMembersPage from '@/app/[locale]/(protected)/research/projects/[projectId]/members/page'
import { getServerSession } from '@/lib/auth/server'
import { getEmployees, getEmployeesAdmin } from '@/requests/employees'
import { getResearchProjectById, getResearchProjectMembers } from '@/requests/researchProjects'
import { CustomSession } from '@/types/auth'

jest.mock('next-intl/server')
jest.mock('next/navigation', () => ({ notFound: jest.fn() }))
jest.mock('@/lib/auth/server', () => ({ getServerSession: jest.fn() }))
jest.mock('@/requests/employees', () => ({
  getEmployees: jest.fn(),
  getEmployeesAdmin: jest.fn(),
}))
jest.mock('@/requests/researchProjects', () => ({
  getResearchProjectById: jest.fn(),
  getResearchProjectMembers: jest.fn(),
}))

jest.mock('@/components/features/Research/ResearchProjectMembersPanel', () => ({
  ResearchProjectMembersPanel: ({
    initialMembers,
    canManageMembers,
    availableMembers,
  }: {
    initialMembers: Array<{ userId: string; name: string; email: string }>
    canManageMembers: boolean
    availableMembers: Array<{ id: string; name: string; email: string }>
  }) => (
    <div>
      <div data-testid="can-manage-members">{String(canManageMembers)}</div>
      <div data-testid="available-members-count">{availableMembers.length}</div>
      {initialMembers.map((member) => (
        <div key={member.userId} data-testid="project-member">
          {member.name}|{member.email}|{member.userId}
        </div>
      ))}
    </div>
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
  user: { id: 'user-1', name: 'Research User', email: 'research.user@example.com', role: 'admin' },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
}

beforeEach(() => {
  jest.clearAllMocks()
  ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
  ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => {
    switch (key) {
      case 'workspace.accessDeniedTitle':
        return 'Access denied'
      case 'workspace.accessDeniedDescription':
        return 'Research workspace access is restricted.'
      default:
        return key
    }
  })
})

describe('Research project members page', () => {
  it('enriches bare member records with company employee directory data', async () => {
    ;(getResearchProjectById as jest.Mock).mockResolvedValue({
      data: {
        companyId: 'company-1',
        permissions: { canManageMembers: false },
        members: [
          {
            id: 'member-1',
            userId: 'scientist-1',
            name: 'scientist-1',
            email: '',
            role: 'scientist',
            grants: [],
            createdAt: null,
            canRemove: false,
          },
        ],
      },
    })
    ;(getResearchProjectMembers as jest.Mock).mockResolvedValue({
      data: [
        {
          id: 'member-1',
          userId: 'scientist-1',
          name: 'scientist-1',
          email: '',
          role: 'scientist',
          grants: [],
          createdAt: null,
          canRemove: false,
        },
      ],
    })
    ;(getEmployeesAdmin as jest.Mock).mockResolvedValue({
      data: {
        total: 1,
        items: [
          {
            id: 'scientist-1',
            name: 'Nadia Koval',
            email: 'nadia.koval@example.com',
          },
        ],
      },
    })

    render(await ResearchProjectMembersPage({ params: Promise.resolve({ projectId: 'project-1' }) }))

    expect(getEmployees).not.toHaveBeenCalled()
    expect(getEmployeesAdmin).toHaveBeenCalledWith(mockSession, 'company-1', 1, 100)
    expect(screen.getByTestId('can-manage-members')).toHaveTextContent('false')
    expect(screen.getByTestId('available-members-count')).toHaveTextContent('1')
    expect(screen.getByTestId('project-member')).toHaveTextContent('Nadia Koval|nadia.koval@example.com|scientist-1')
  })

  it('delegates non-403 project failures to notFound', async () => {
    ;(getResearchProjectById as jest.Mock).mockResolvedValue({ error: 'Missing', status: 404 })
    ;(notFound as unknown as jest.Mock).mockImplementation(() => {
      throw new Error('NEXT_NOT_FOUND')
    })

    await expect(ResearchProjectMembersPage({ params: Promise.resolve({ projectId: 'project-1' }) })).rejects.toThrow(
      'NEXT_NOT_FOUND'
    )
  })
})
