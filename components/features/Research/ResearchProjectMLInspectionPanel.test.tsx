import { render, screen } from '@testing-library/react'

import { ResearchProjectMLInspectionPanel } from '@/components/features/Research/ResearchProjectMLInspectionPanel'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    switch (key) {
      case 'common.notAvailable':
        return 'Not available'
      case 'labels.target':
        return 'Target'
      case 'labels.targetId':
        return 'Target'
      case 'labels.subjectId':
        return 'Participant'
      case 'labels.modelVersion':
        return 'Model version'
      case 'labels.contract':
        return 'Contract'
      case 'options.mlTarget.cohort':
        return 'Cohort'
      case 'options.mlTarget.group':
        return 'Group'
      case 'options.mlTarget.subject':
        return 'Subject'
      case 'options.mlTarget.project':
        return 'Project'
      case 'panels.mlInspection.title':
        return 'Model inspection'
      case 'panels.mlInspection.inspectButton':
        return 'Inspect'
      case 'common.loading':
        return 'Loading'
      case 'workspace.accessDeniedTitle':
        return 'Access denied'
      case 'panels.mlInspection.accessDeniedDescription':
        return 'No access'
      default:
        return key
    }
  },
}))

jest.mock('@/context/AuthProvider', () => ({
  useAuth: () => ({ session: { user: { id: 'user-1' } } }),
}))

jest.mock('@/requests/researchProjects', () => ({
  getResearchProjectMLInspection: jest.fn(),
}))

jest.mock('@/components/shared/Cards/StaticCard', () => ({
  StaticCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/components/features/Research/ResearchStateCard', () => ({
  ResearchStateCard: ({ title, description }: { title: string; description: string }) => (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  ),
}))

jest.mock('@/ui/button', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}))

jest.mock('@/ui/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}))

jest.mock('@/ui/label', () => ({
  Label: ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}))

jest.mock('@/ui/select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children, id }: { children: React.ReactNode; id?: string }) => <div id={id}>{children}</div>,
  SelectValue: () => null,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('ResearchProjectMLInspectionPanel', () => {
  it('renders group target names instead of raw target ids', () => {
    render(
      <ResearchProjectMLInspectionPanel
        projectId="project-1"
        projectName="Burnout Signal"
        availableGroups={[{ id: 'group-1', name: 'Core Team', type: 'team' }]}
        subjectOptions={[]}
        canViewMlInspection
        initialInspection={{
          target: 'group',
          targetId: 'group-1',
          modelVersion: 'v1',
          contract: 'standard-dpa',
          governanceMetadata: {},
          payload: {},
        }}
      />
    )

    expect(screen.getAllByText('Core Team').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Group').length).toBeGreaterThan(0)
    expect(screen.queryByText('group')).not.toBeInTheDocument()
    expect(screen.queryByText('group-1')).not.toBeInTheDocument()
  })
})
