import { render, screen } from '@testing-library/react'

import { ResearchProjectGrantsPanel } from '@/components/features/Research/ResearchProjectGrantsPanel'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    switch (key) {
      case 'common.notAvailable':
        return 'Not available'
      case 'labels.groupIds':
        return 'Groups'
      case 'labels.allowedContracts':
        return 'Allowed contracts'
      case 'labels.allowedTargets':
        return 'Allowed targets'
      case 'labels.allowedFields':
        return 'Allowed fields'
      case 'labels.userSelectionMode':
        return 'User selection mode'
      case 'labels.pseudonymizationMode':
        return 'Pseudonymization mode'
      case 'labels.from':
        return 'From'
      case 'labels.to':
        return 'To'
      case 'labels.exportAllowed':
        return 'Export allowed'
      case 'panels.grants.currentTitle':
        return 'Current grants'
      case 'panels.grants.createTitle':
        return 'Create grant'
      case 'panels.grants.exportAllowedBadge':
        return 'Export allowed'
      case 'panels.grants.noExportBadge':
        return 'No export'
      case 'panels.grants.allowedFieldsPlaceholder':
        return 'Add field'
      case 'panels.grants.allowedContractsPlaceholder':
        return 'Add contract'
      case 'panels.grants.allowedTargetsPlaceholder':
        return 'Add target'
      case 'panels.grants.exportAllowedDescription':
        return 'Allow export'
      case 'panels.grants.createButton':
        return 'Create grant'
      case 'common.saving':
        return 'Saving'
      case 'options.userSelectionMode.all':
        return 'All users'
      case 'options.userSelectionMode.groups_only':
        return 'Groups only'
      case 'options.userSelectionMode.explicit_users':
        return 'Explicit users'
      case 'options.pseudonymizationMode.required':
        return 'Required'
      case 'options.pseudonymizationMode.optional':
        return 'Optional'
      case 'options.pseudonymizationMode.none':
        return 'None'
      default:
        return key
    }
  },
}))

jest.mock('@/context/AuthProvider', () => ({
  useAuth: () => ({ session: { user: { id: 'user-1' } } }),
}))

jest.mock('@/requests/researchProjects', () => ({
  createResearchProjectGrant: jest.fn(),
}))

jest.mock('@/components/shared/Cards/StaticCard', () => ({
  StaticCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/components/features/Research/ResearchMultiSelectField', () => ({
  ResearchMultiSelectField: ({ label }: { label: string }) => <div>{label}</div>,
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
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: () => null,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/ui/switch', () => ({
  Switch: ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) => (
    <input type="checkbox" checked={checked} onChange={(event) => onCheckedChange(event.target.checked)} />
  ),
}))

describe('ResearchProjectGrantsPanel', () => {
  it('renders grant group names instead of raw ids and removes the manual id input', () => {
    render(
      <ResearchProjectGrantsPanel
        projectId="project-1"
        initialGrants={[
          {
            id: 'grant-1',
            title: 'Core dataset',
            allowedContracts: ['standard-dpa'],
            allowedFields: ['moodScore'],
            allowedTargets: ['subject'],
            groupIds: ['group-1'],
            userSelectionMode: 'groups_only',
            pseudonymizationMode: 'required',
            from: null,
            to: null,
            exportAllowed: true,
            createdAt: null,
          },
        ]}
        availableGroups={[
          { id: 'group-1', name: 'Core Team', type: 'team' },
          { id: 'group-2', name: 'Support Team', type: 'team' },
        ]}
        canManageGrants
      />
    )

    expect(screen.getByText('Groups: Core Team')).toBeInTheDocument()
    expect(screen.getByText('Core Team')).toBeInTheDocument()
    expect(screen.queryByText('group-1')).not.toBeInTheDocument()
    expect(screen.queryByPlaceholderText('panels.cohort.groupIdsPlaceholder')).not.toBeInTheDocument()
  })
})
