import { render, screen } from '@testing-library/react'

import { ResearchProjectCohortPanel } from '@/components/features/Research/ResearchProjectCohortPanel'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    switch (key) {
      case 'common.notAvailable':
        return 'Not available'
      case 'labels.availableGroups':
        return 'Available groups'
      case 'labels.groupIds':
        return 'Group IDs'
      case 'labels.userSelectionMode':
        return 'User selection mode'
      case 'labels.from':
        return 'From'
      case 'labels.to':
        return 'To'
      case 'labels.resolvedGroupIds':
        return 'Resolved group IDs'
      case 'options.userSelectionMode.all':
        return 'All users'
      case 'options.userSelectionMode.groups_only':
        return 'Groups only'
      case 'options.userSelectionMode.explicit_users':
        return 'Explicit users'
      case 'panels.cohort.title':
        return 'Cohort settings'
      case 'panels.cohort.previewTitle':
        return 'Cohort preview'
      case 'panels.cohort.noGroupsSelected':
        return 'No groups selected'
      case 'panels.cohort.noResolvedGroups':
        return 'No resolved groups'
      case 'panels.cohort.saveButton':
        return 'Save cohort'
      case 'common.saving':
        return 'Saving'
      default:
        return key
    }
  },
}))

jest.mock('@/context/AuthProvider', () => ({
  useAuth: () => ({ session: { user: { id: 'user-1' } } }),
}))

jest.mock('@/requests/researchProjects', () => ({
  updateResearchProjectCohort: jest.fn(),
}))

jest.mock('@/components/shared/Cards/StaticCard', () => ({
  StaticCard: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}))

jest.mock('@/ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}))

jest.mock('@/ui/button', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}))

jest.mock('@/ui/checkbox', () => ({
  Checkbox: ({
    checked,
    onCheckedChange,
    id,
    disabled,
  }: {
    checked: boolean
    onCheckedChange: () => void
    id: string
    disabled?: boolean
  }) => <input type="checkbox" id={id} checked={checked} onChange={onCheckedChange} disabled={disabled} />,
}))

jest.mock('@/ui/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}))

jest.mock('@/ui/label', () => ({
  Label: ({ children, htmlFor, className }: { children: React.ReactNode; htmlFor?: string; className?: string }) => (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  ),
}))

jest.mock('@/ui/select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children, id }: { children: React.ReactNode; id?: string }) => <div id={id}>{children}</div>,
  SelectValue: () => null,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('ResearchProjectCohortPanel', () => {
  const availableGroups = [
    { id: 'group-1', name: 'Core Team', type: 'team' },
    { id: 'group-2', name: 'Support Team', type: 'team' },
  ]

  const initialCohort = {
    groupIds: ['group-1'],
    userSelectionMode: 'groups_only',
    from: '2026-05-01',
    to: '2026-05-31',
    resolvedGroupIds: ['group-1', 'group-2'],
  }

  it('renders group names instead of raw ids in read-only mode', () => {
    render(
      <ResearchProjectCohortPanel
        projectId="project-1"
        initialCohort={initialCohort}
        availableGroups={availableGroups}
        canManageCohort={false}
      />
    )

    expect(screen.getByText('Groups only')).toBeInTheDocument()
    expect(screen.getAllByText('Core Team').length).toBeGreaterThan(0)
    expect(screen.getByText('Support Team')).toBeInTheDocument()
    expect(screen.queryByText('group-1')).not.toBeInTheDocument()
    expect(screen.queryByText('group-2')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Save cohort' })).not.toBeInTheDocument()
  })

  it('does not render raw group id inputs in edit mode', () => {
    render(
      <ResearchProjectCohortPanel
        projectId="project-1"
        initialCohort={initialCohort}
        availableGroups={availableGroups}
        canManageCohort
      />
    )

    expect(screen.getByLabelText('From')).toBeInTheDocument()
    expect(screen.getByLabelText('To')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('panels.cohort.groupIdsPlaceholder')).not.toBeInTheDocument()
    expect(screen.queryByDisplayValue('group-1')).not.toBeInTheDocument()
    expect(screen.queryByText('group-1')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save cohort' })).toBeInTheDocument()
  })
})
