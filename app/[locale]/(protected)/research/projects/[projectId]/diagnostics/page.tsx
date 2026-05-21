import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { ResearchProjectMLInspectionPanel } from '@/components/features/Research/ResearchProjectMLInspectionPanel'
import { ResearchStateCard } from '@/components/features/Research/ResearchStateCard'
import { getServerSession } from '@/lib/auth/server'
import { getResearchProjectById, getResearchProjectHistoryDataset } from '@/requests/researchProjects'
import { CustomSession } from '@/types/auth'

export default async function ResearchProjectDiagnosticsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const session = await getServerSession()
  const t = await getTranslations('pages.Research')
  const result = await getResearchProjectById(session as CustomSession, projectId)

  if ('error' in result) {
    if (result.status === 403) {
      return (
        <ResearchStateCard
          title={t('workspace.accessDeniedTitle')}
          description={t('workspace.accessDeniedDescription')}
        />
      )
    }

    notFound()
  }

  const datasetResult = await getResearchProjectHistoryDataset(session as CustomSession, projectId, { limit: 100 })
  const subjectOptions =
    'data' in datasetResult
      ? Array.from(
          new Map(
            datasetResult.data.items.map((item, index) => [item.subjectId, `${t('labels.subjectId')} ${index + 1}`])
          )
        ).map(([id, label]) => ({ id, label }))
      : []

  return (
    <ResearchProjectMLInspectionPanel
      projectId={projectId}
      projectName={result.data.name}
      availableGroups={result.data.availableGroups}
      subjectOptions={subjectOptions}
      canViewMlInspection={result.data.permissions.canViewMlInspection}
    />
  )
}
