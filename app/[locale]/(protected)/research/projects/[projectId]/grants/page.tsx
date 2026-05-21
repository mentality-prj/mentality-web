import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { ResearchProjectGrantsPanel } from '@/components/features/Research/ResearchProjectGrantsPanel'
import { ResearchStateCard } from '@/components/features/Research/ResearchStateCard'
import { getServerSession } from '@/lib/auth/server'
import { getResearchProjectById, getResearchProjectGrants } from '@/requests/researchProjects'
import { CustomSession } from '@/types/auth'

export default async function ResearchProjectGrantsPage({ params }: { params: Promise<{ projectId: string }> }) {
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

  const grantsResult = await getResearchProjectGrants(session as CustomSession, projectId)

  if ('error' in grantsResult && grantsResult.status === 403) {
    return (
      <ResearchStateCard
        title={t('workspace.accessDeniedTitle')}
        description={t('workspace.accessDeniedDescription')}
      />
    )
  }

  const suggestedFields = Array.from(
    new Set(('data' in grantsResult ? grantsResult.data : []).flatMap((grant) => grant.allowedFields).filter(Boolean))
  )

  return (
    <ResearchProjectGrantsPanel
      projectId={projectId}
      initialGrants={'data' in grantsResult ? grantsResult.data : []}
      availableGroups={projectResult.data.availableGroups}
      canManageGrants={projectResult.data.permissions.canManageGrants}
      suggestedFields={suggestedFields}
    />
  )
}
