import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { ResearchProjectOverview } from '@/components/features/Research/ResearchProjectOverview'
import { ResearchStateCard } from '@/components/features/Research/ResearchStateCard'
import { getResearchScientistOptions } from '@/helpers/researchScientists'
import { getServerSession } from '@/lib/auth/server'
import { getResearchProjectById } from '@/requests/researchProjects'
import { CustomSession } from '@/types/auth'

export default async function ResearchProjectDashboardPage({ params }: { params: Promise<{ projectId: string }> }) {
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

  const principalInvestigatorOptions = await getResearchScientistOptions(
    session as CustomSession,
    result.data.companyId
  )

  return <ResearchProjectOverview project={result.data} principalInvestigatorOptions={principalInvestigatorOptions} />
}
