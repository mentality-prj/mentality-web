import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { ResearchProjectHistoryDatasetPanel } from '@/components/features/Research/ResearchProjectHistoryDatasetPanel'
import { ResearchStateCard } from '@/components/features/Research/ResearchStateCard'
import { getServerSession } from '@/lib/auth/server'
import { getResearchProjectById, getResearchProjectHistoryDataset } from '@/requests/researchProjects'
import { CustomSession } from '@/types/auth'

export default async function ResearchProjectDatasetsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const session = await getServerSession()
  const t = await getTranslations('pages.Research')
  const projectResult = await getResearchProjectById(session as CustomSession, projectId)

  if ('error' in projectResult) {
    if (projectResult.status === 403) {
      return (
        <ResearchStateCard
          title={t('workspace.accessDeniedTitle')}
          description={t('workspace.accessDeniedDescription')}
        />
      )
    }

    notFound()
  }

  const datasetResult = await getResearchProjectHistoryDataset(session as CustomSession, projectId, { limit: 25 })

  if ('error' in datasetResult && datasetResult.status === 403) {
    return (
      <ResearchStateCard
        title={t('workspace.accessDeniedTitle')}
        description={t('workspace.accessDeniedDescription')}
      />
    )
  }

  return (
    <ResearchProjectHistoryDatasetPanel
      projectId={projectId}
      initialDataset={'data' in datasetResult ? datasetResult.data : { items: [], columns: [], total: 0 }}
      availableGroups={projectResult.data.availableGroups}
      canViewHistoryDataset={projectResult.data.permissions.canViewHistoryDataset}
    />
  )
}
