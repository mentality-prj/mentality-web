import { getTranslations } from 'next-intl/server'

import { ResearchProjectsList } from '@/components/features/Research/ResearchProjectsList'
import { ResearchStateCard } from '@/components/features/Research/ResearchStateCard'
import { getLocalizedResearchErrorMessage } from '@/helpers/researchErrorMessage'
import { getServerSession } from '@/lib/auth/server'
import { getResearchProjects, getResearchWorkspaceAccess } from '@/requests/researchProjects'
import { CustomSession } from '@/types/auth'

export default async function ResearchProjectsPage() {
  const session = await getServerSession()
  const t = await getTranslations('pages.Research')
  const accessResult = await getResearchWorkspaceAccess(session as CustomSession)

  if ('error' in accessResult) {
    return (
      <ResearchStateCard
        title={t('workspace.unavailableTitle')}
        description={getLocalizedResearchErrorMessage(accessResult.error, t)}
      />
    )
  }

  if (!accessResult.data.hasAccess) {
    return (
      <ResearchStateCard
        title={t('workspace.accessDeniedTitle')}
        description={t('workspace.accessDeniedDescription')}
      />
    )
  }

  const result = await getResearchProjects(session as CustomSession)

  if ('error' in result) {
    return (
      <ResearchStateCard
        title={t('projects.unavailableTitle')}
        description={getLocalizedResearchErrorMessage(result.error, t)}
      />
    )
  }

  const projects = result.data

  return (
    <div className="flex flex-col gap-md">
      <div>
        <h2 className="text-lg font-semibold text-textcolor-primary">{t('projects.title')}</h2>
        <p className="mt-2 text-sm text-textcolor-secondary">{t('projects.subtitle')}</p>
      </div>
      <ResearchProjectsList projects={projects} />
    </div>
  )
}
