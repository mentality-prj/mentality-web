import { render, screen } from '@testing-library/react'

import { ResearchProjectsList } from '@/components/features/Research/ResearchProjectsList'
import { ResearchProject } from '@/types/research'

jest.mock('next-intl', () => ({
  useLocale: () => 'en-US',
  useTranslations: () => (key: string) => {
    switch (key) {
      case 'projects.empty':
        return 'No projects yet'
      case 'common.notAvailable':
        return 'Not available'
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

jest.mock('@/components/admin/DashboardItem', () => ({
  DashboardItem: ({ title, subtitle, badge }: { title: string; subtitle?: string; badge?: React.ReactNode }) => (
    <div>
      <h3>{title}</h3>
      {subtitle ? <p>{subtitle}</p> : null}
      {badge}
    </div>
  ),
}))

function buildProject(overrides: Partial<ResearchProject> = {}): ResearchProject {
  return {
    id: 'project-1',
    name: 'Sleep Resilience',
    description: 'Observational resilience study',
    objective: 'Observational resilience study',
    status: 'active',
    approvalStatus: 'approved',
    exportPolicy: 'review_required',
    pseudonymizationMode: 'required',
    principalInvestigatorId: 'pi-1',
    retentionUntil: null,
    consentMode: 'company_boundary_only',
    companyId: 'company-1',
    companyName: 'Acme Research',
    currentUserRole: 'scientist',
    permissions: {
      canViewProject: true,
      canCreateProject: false,
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
    startsAt: '2026-01-01T00:00:00.000Z',
    endsAt: '2026-01-31T00:00:00.000Z',
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

describe('ResearchProjectsList', () => {
  it('renders the empty state when no projects are available', () => {
    render(<ResearchProjectsList projects={[]} />)

    expect(screen.getByText('No projects yet')).toBeInTheDocument()
  })

  it('renders localized known status labels and formatted dates', () => {
    render(<ResearchProjectsList projects={[buildProject()]} />)

    expect(screen.getByRole('heading', { name: 'Sleep Resilience' })).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Acme Research · 1/1/2026 - 1/31/2026')).toBeInTheDocument()
  })

  it('falls back safely for unknown statuses and invalid dates', () => {
    render(
      <ResearchProjectsList
        projects={[
          buildProject({
            status: 'under_review',
            companyName: '',
            startsAt: '',
            endsAt: 'not-a-date',
          }),
        ]}
      />
    )

    expect(screen.getByText('under_review')).toBeInTheDocument()
    expect(screen.getByText('Not available · Not available')).toBeInTheDocument()
  })
})
