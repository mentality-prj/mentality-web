import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { ResearchProjectCohortPanel } from '@/components/features/Research/ResearchProjectCohortPanel'
import { ResearchStateCard } from '@/components/features/Research/ResearchStateCard'
import { getServerSession } from '@/lib/auth/server'
import { getResearchProjectById, getResearchProjectCohort } from '@/requests/researchProjects'
import { CustomSession } from '@/types/auth'

export default async function ResearchProjectCohortPage({ params }: { params: Promise<{ projectId: string }> }) {
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

  const cohortResult = await getResearchProjectCohort(session as CustomSession, projectId)

  if ('error' in cohortResult && cohortResult.status === 403) {
    return (
      <ResearchStateCard
        title={t('workspace.accessDeniedTitle')}
        description={t('workspace.accessDeniedDescription')}
      />
    )
  }

  return (
    <ResearchProjectCohortPanel
      projectId={projectId}
      initialCohort={'data' in cohortResult ? cohortResult.data : null}
      availableGroups={projectResult.data.availableGroups}
      canManageCohort={projectResult.data.permissions.canManageCohort}
    />
  )
}
