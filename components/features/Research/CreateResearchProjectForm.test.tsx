import { render, screen } from '@testing-library/react'

import { CreateResearchProjectForm } from '@/components/features/Research/CreateResearchProjectForm'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    switch (key) {
      case 'workspace.accessDeniedTitle':
        return 'Access denied'
      case 'create.accessDenied':
        return 'Access denied description'
      case 'common.notAvailable':
        return 'Not available'
      case 'labels.company':
        return 'Company'
      case 'labels.projectName':
        return 'Project name'
      case 'labels.description':
        return 'Description'
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
      case 'options.pseudonymizationMode.required':
        return 'Required'
      case 'options.pseudonymizationMode.optional':
        return 'Optional'
      case 'options.pseudonymizationMode.none':
        return 'None'
      case 'create.title':
        return 'Create research project'
      case 'create.principalInvestigatorPlaceholder':
        return 'Select principal investigator'
      case 'common.cancel':
        return 'Cancel'
      default:
        return key
    }
  },
}))

jest.mock('@/context/AuthProvider', () => ({
  useAuth: () => ({ session: { user: { id: 'user-1', name: 'Research User' } } }),
}))

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

jest.mock('@/requests/researchProjects', () => ({
  createResearchProject: jest.fn(),
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
  SelectValue: ({ placeholder }: { placeholder?: string }) => <>{placeholder ?? null}</>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/ui/textarea', () => ({
  Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} />,
}))

describe('CreateResearchProjectForm', () => {
  it('shows a principal investigator placeholder and does not preselect the first scientist', () => {
    render(
      <CreateResearchProjectForm
        access={{
          hasAccess: true,
          canCreateProjects: true,
          capabilities: ['research_admin'],
          companies: [{ id: 'company-1', name: 'Acme Research' }],
          scientists: [],
        }}
        principalInvestigatorOptions={[
          {
            id: 'scientist-1',
            companyId: 'company-1',
            name: 'Nadia Koval',
            email: 'nadia.koval@example.com',
          },
        ]}
      />
    )

    expect(screen.getByText('Select principal investigator')).toBeInTheDocument()
    expect(screen.getByText('Nadia Koval (nadia.koval@example.com)')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('scientist-1')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create research project' })).toBeDisabled()
  })
})
