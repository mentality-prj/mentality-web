import { fireEvent, render, screen } from '@testing-library/react'

import { ResearchProjectHistoryDatasetPanel } from '@/components/features/Research/ResearchProjectHistoryDatasetPanel'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    switch (key) {
      case 'common.notAvailable':
        return 'Not available'
      case 'labels.from':
        return 'From'
      case 'labels.to':
        return 'To'
      case 'labels.limit':
        return 'Limit'
      case 'labels.subjectId':
        return 'Participant'
      case 'labels.cohort':
        return 'Cohort'
      case 'labels.dateRange':
        return 'Date range'
      case 'labels.diagnostics':
        return 'Diagnostics'
      case 'common.loading':
        return 'Loading'
      case 'common.applyFilters':
        return 'Apply filters'
      case 'panels.historyDataset.title':
        return 'History dataset'
      case 'panels.historyDataset.exportTitle':
        return 'Export dataset'
      case 'panels.historyDataset.exportCsvButton':
        return 'Download CSV'
      case 'panels.historyDataset.exportXmlButton':
        return 'Download XML'
      case 'panels.historyDataset.exportExcelButton':
        return 'Download Excel'
      case 'panels.historyDataset.emptyTitle':
        return 'Dataset empty'
      case 'panels.historyDataset.emptyDescription':
        return 'No records found.'
      case 'panels.historyDataset.accessDeniedDescription':
        return 'Access denied'
      case 'workspace.accessDeniedTitle':
        return 'Access denied'
      default:
        return key
    }
  },
}))

jest.mock('@/context/AuthProvider', () => ({
  useAuth: () => ({ session: { user: { id: 'user-1' } } }),
}))

jest.mock('@/requests/researchProjects', () => ({
  getResearchProjectHistoryDataset: jest.fn(),
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

describe('ResearchProjectHistoryDatasetPanel', () => {
  beforeEach(() => {
    global.URL.createObjectURL = jest.fn(() => 'blob:history-dataset')
    global.URL.revokeObjectURL = jest.fn()
  })

  it('replaces raw subject ids with participant labels and resolves cohort names', () => {
    render(
      <ResearchProjectHistoryDatasetPanel
        projectId="project-1"
        initialDataset={{
          total: 1,
          columns: ['stressScore'],
          items: [
            {
              id: 'row-1',
              subjectId: 'subject-1',
              cohort: 'group-1',
              dateRange: '2026-05-01 - 2026-05-31',
              diagnostics: 'Stable',
              fields: { stressScore: '7' },
              raw: {},
            },
          ],
        }}
        availableGroups={[{ id: 'group-1', name: 'Core Team', type: 'team' }]}
        canViewHistoryDataset
      />
    )

    expect(screen.getByText('Participant 1')).toBeInTheDocument()
    expect(screen.getByText('Core Team')).toBeInTheDocument()
    expect(screen.queryByText('subject-1')).not.toBeInTheDocument()
    expect(screen.queryByText('group-1')).not.toBeInTheDocument()
  })

  it('offers csv, xml and excel exports for the current dataset', () => {
    render(
      <ResearchProjectHistoryDatasetPanel
        projectId="project-1"
        initialDataset={{
          total: 1,
          columns: ['values'],
          items: [
            {
              id: 'row-1',
              subjectId: 'subject-1',
              cohort: 'group-1',
              dateRange: '2026-05-01 - 2026-05-31',
              diagnostics: 'Stable',
              fields: { values: '{"riskLevel":"medium"}' },
              raw: {},
            },
          ],
        }}
        availableGroups={[{ id: 'group-1', name: 'Core Team', type: 'team' }]}
        canViewHistoryDataset
      />
    )

    const clickMock = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const element = originalCreateElement(tagName)

      if (tagName === 'a') {
        Object.defineProperty(element, 'click', {
          value: clickMock,
          configurable: true,
        })
      }

      return element
    })

    fireEvent.click(screen.getByRole('button', { name: 'Download CSV' }))
    fireEvent.click(screen.getByRole('button', { name: 'Download XML' }))
    fireEvent.click(screen.getByRole('button', { name: 'Download Excel' }))

    expect(screen.getByText('Export dataset')).toBeInTheDocument()
    expect(global.URL.createObjectURL).toHaveBeenCalledTimes(3)
    expect(clickMock).toHaveBeenCalledTimes(3)

    createElementSpy.mockRestore()
  })
})
