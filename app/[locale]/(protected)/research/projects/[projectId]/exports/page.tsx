import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { ResearchProjectExportsPanel } from '@/components/features/Research/ResearchProjectExportsPanel'
import { ResearchStateCard } from '@/components/features/Research/ResearchStateCard'
import { getServerSession } from '@/lib/auth/server'
import { getResearchProjectById, getResearchProjectGrants } from '@/requests/researchProjects'
import { CustomSession } from '@/types/auth'

export default async function ResearchProjectExportsPage({ params }: { params: Promise<{ projectId: string }> }) {
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
    <ResearchProjectExportsPanel
      projectId={projectId}
      canRequestExports={projectResult.data.permissions.canRequestExports}
      suggestedFields={suggestedFields}
    />
  )
}
