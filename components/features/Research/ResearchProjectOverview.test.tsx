import { fireEvent, render, screen } from '@testing-library/react'

import { ResearchProjectOverview } from '@/components/features/Research/ResearchProjectOverview'
import { ResearchProject } from '@/types/research'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    switch (key) {
      case 'common.notAvailable':
        return 'Not available'
      case 'labels.status':
        return 'Status'
      case 'labels.approvalStatus':
        return 'Approval status'
      case 'labels.exportPolicy':
        return 'Export policy'
      case 'labels.pseudonymizationMode':
        return 'Pseudonymization mode'
      case 'labels.principalInvestigator':
        return 'Principal investigator'
      case 'labels.projectName':
        return 'Project name'
      case 'labels.description':
        return 'Description'
      case 'panels.overview.metadataTitle':
        return 'Project metadata'
      case 'panels.overview.editButton':
        return 'Edit metadata'
      case 'panels.overview.saveButton':
        return 'Save metadata'
      case 'common.cancel':
        return 'Cancel'
      case 'options.approvalStatus.draft':
        return 'Draft'
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
      case 'options.pseudonymizationMode.required':
        return 'Required'
      case 'options.pseudonymizationMode.optional':
        return 'Optional'
      case 'options.pseudonymizationMode.none':
        return 'None'
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
      default:
        return key
    }
  },
}))

jest.mock('@/context/AuthProvider', () => ({
  useAuth: () => ({ session: { user: { id: 'user-1' } } }),
}))

jest.mock('@/requests/researchProjects', () => ({
  updateResearchProject: jest.fn(),
}))

jest.mock('@/components/shared/Cards/StaticCard', () => ({
  StaticCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
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

jest.mock('@/ui/textarea', () => ({
  Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} />,
}))

function buildProject(overrides: Partial<ResearchProject> = {}): ResearchProject {
  return {
    id: 'project-1',
    name: 'Burnout Signal',
    description: 'Longitudinal observation.',
    objective: 'Longitudinal observation.',
    status: 'active',
    approvalStatus: 'approved',
    exportPolicy: 'allowed',
    pseudonymizationMode: 'required',
    principalInvestigatorId: 'scientist-1',
    retentionUntil: null,
    consentMode: 'company_boundary_only',
    companyId: 'company-1',
    companyName: 'Acme Research',
    currentUserRole: 'research_admin',
    permissions: {
      canViewProject: true,
      canCreateProject: true,
      canUpdateProject: true,
      canManageMembers: true,
      canManageCohort: true,
      canManageGrants: true,
      canViewMlInspection: true,
      canViewHistoryDataset: true,
      canRequestExports: true,
      canViewAudit: true,
    },
    createdAt: null,
    updatedAt: null,
    metadata: {},
    startsAt: '',
    endsAt: '',
    targetCohort: '',
    cohortSize: 0,
    rawMlFeaturesAllowed: false,
    exportAllowed: true,
    pseudonymizationRequired: true,
    availableGroups: [],
    selectedGroupIds: [],
    inclusionRules: [],
    members: [],
    grantsList: [],
    cohort: null,
    availableDatasets: [],
    latestModelRuns: [],
    exportJob: {
      id: '',
      status: 'not_requested',
      format: 'json',
      requestedAt: null,
      completedAt: null,
    },
    auditAlerts: [],
    exportAuditLog: [],
    diagnostics: {
      modelVersion: '',
      riskScore: '',
      anomalyScore: '',
      adaptiveRisk: '',
      modelHealth: '',
      rawFeatureVector: null,
      auditLog: [],
    },
    ...overrides,
  }
}

describe('ResearchProjectOverview', () => {
  it('shows read-only project metadata by default and hides edit inputs', () => {
    render(
      <ResearchProjectOverview
        project={buildProject()}
        principalInvestigatorOptions={[{ id: 'scientist-1', name: 'Nadia Koval', email: 'nadia.koval@example.com' }]}
      />
    )

    expect(screen.getByRole('button', { name: 'Edit metadata' })).toBeInTheDocument()
    expect(screen.getByText('Burnout Signal')).toBeInTheDocument()
    expect(screen.getByText('Nadia Koval')).toBeInTheDocument()
    expect(screen.queryByText('scientist-1')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Project name')).not.toBeInTheDocument()
  })

  it('switches to edit mode when the edit icon is clicked', () => {
    render(
      <ResearchProjectOverview
        project={buildProject()}
        principalInvestigatorOptions={[{ id: 'scientist-1', name: 'Nadia Koval', email: 'nadia.koval@example.com' }]}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Edit metadata' }))

    expect(screen.getByLabelText('Project name')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByText('Nadia Koval (nadia.koval@example.com)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })
})
