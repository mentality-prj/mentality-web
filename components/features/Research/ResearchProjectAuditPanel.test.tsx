import { render, screen } from '@testing-library/react'

import { ResearchProjectAuditPanel } from '@/components/features/Research/ResearchProjectAuditPanel'

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string, values?: Record<string, string | number>) => {
    switch (key) {
      case 'common.notAvailable':
        return 'Not available'
      case 'labels.eventType':
        return 'Event type'
      case 'labels.actorUserId':
        return 'Actor'
      case 'labels.createdAt':
        return 'Created at'
      case 'labels.details':
        return 'Details'
      case 'labels.format':
        return 'Format'
      case 'labels.requestedFields':
        return 'Requested fields'
      case 'labels.exportPolicy':
        return 'Export policy'
      case 'labels.target':
        return 'Target'
      case 'labels.modelVersion':
        return 'Model version'
      case 'labels.grantTitle':
        return 'Grant title'
      case 'labels.limit':
        return 'Limit'
      case 'options.exportPolicy.review_required':
        return 'Review required'
      case 'options.exportPolicy.allowed':
        return 'Allowed'
      case 'options.exportPolicy.blocked':
        return 'Blocked'
      case 'options.exportPolicy.inline_ready':
        return 'Inline ready'
      case 'options.exportPolicy.disabled':
        return 'Disabled'
      case 'options.mlTarget.group':
        return 'Group'
      case 'options.mlTarget.subject':
        return 'Subject'
      case 'options.mlTarget.cohort':
        return 'Cohort'
      case 'options.mlTarget.project':
        return 'Project'
      case 'panels.audit.emptyTitle':
        return 'No audit events'
      case 'panels.audit.emptyDescription':
        return 'No audit events yet.'
      case 'panels.audit.metadata.resultCount':
        return 'Records'
      case 'panels.audit.targets.team':
        return 'Team'
      case 'panels.audit.eventTypes.history_dataset_viewed':
        return 'History dataset viewed'
      case 'panels.audit.eventTypes.export_review_requested':
        return 'Export review requested'
      case 'panels.audit.eventTypes.ml_inspection_viewed':
        return 'ML inspection viewed'
      case 'panels.audit.eventTypes.data_grant_created':
        return 'Data grant created'
      case 'panels.audit.eventTypes.export_requested':
        return 'Export requested'
      case 'panels.audit.details.empty':
        return 'No additional details.'
      case 'panels.audit.details.historyDatasetViewed':
        return `Viewed ${values?.resultCount} records with a limit of ${values?.limit}.`
      case 'panels.audit.details.historyDatasetCountOnly':
        return `Viewed ${values?.resultCount} records.`
      case 'panels.audit.details.limitOnly':
        return `Sampling limit: ${values?.limit}.`
      case 'panels.audit.details.exportRequested':
        return `Requested export in ${values?.format} format.`
      case 'panels.audit.details.requestedFields':
        return `Fields: ${values?.fields}.`
      case 'panels.audit.details.policyStatus':
        return `Export policy: ${values?.policyStatus}.`
      case 'panels.audit.details.mlInspectionViewed':
        return `Viewed inspection for target: ${values?.target}.`
      case 'panels.audit.details.modelVersion':
        return `Model version: ${values?.modelVersion}.`
      case 'panels.audit.details.dataGrantCreated':
        return 'Created a new data access grant.'
      case 'panels.audit.details.grantTitle':
        return `Grant title: ${values?.title}.`
      case 'panels.audit.details.metadataLine':
        return `${values?.label}: ${values?.value}`
      default:
        return key
    }
  },
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

describe('ResearchProjectAuditPanel', () => {
  it('renders actor names and readable event labels instead of raw backend values', () => {
    render(
      <ResearchProjectAuditPanel
        events={[
          {
            id: 'event-1',
            eventType: 'grant.created',
            actorUserId: 'scientist-1',
            route: '/research/projects/project-1/grants',
            createdAt: '2026-05-20T10:00:00.000Z',
            details: 'Grant created',
            metadata: {},
          },
        ]}
        actorNamesById={{ 'scientist-1': 'Nadia Koval' }}
      />
    )

    expect(screen.getByText('Data grant created')).toBeInTheDocument()
    expect(screen.getByText('Nadia Koval')).toBeInTheDocument()
    expect(screen.getByText('Created a new data access grant.')).toBeInTheDocument()
    expect(screen.queryByText('grant.created')).not.toBeInTheDocument()
    expect(screen.queryByText('/research/projects/project-1/grants')).not.toBeInTheDocument()
    expect(screen.queryByText('scientist-1')).not.toBeInTheDocument()
  })

  it('formats backend audit payloads into readable details and timestamps', () => {
    render(
      <ResearchProjectAuditPanel
        events={[
          {
            id: 'event-2',
            eventType: 'history_dataset_viewed',
            actorUserId: 'system',
            route: '/api/research/v1/projects/project-1/history?limit=25',
            createdAt: '2026-05-16T22:54:00.190Z',
            details: '{"resultCount":16,"limit":25}',
            metadata: {
              resultCount: '16',
              limit: '25',
            },
          },
        ]}
      />
    )

    expect(screen.getByText('History dataset viewed')).toBeInTheDocument()
    expect(screen.getByText('Viewed 16 records with a limit of 25.')).toBeInTheDocument()
    expect(screen.queryByText('{"resultCount":16,"limit":25}')).not.toBeInTheDocument()
    expect(screen.queryByText('2026-05-16T22:54:00.190Z')).not.toBeInTheDocument()
    expect(screen.queryByText('/api/research/v1/projects/project-1/history?limit=25')).not.toBeInTheDocument()
  })
})
