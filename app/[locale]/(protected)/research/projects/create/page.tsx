import { getTranslations } from 'next-intl/server'

import { CreateResearchProjectForm } from '@/components/features/Research/CreateResearchProjectForm'
import { ResearchStateCard } from '@/components/features/Research/ResearchStateCard'
import { getLocalizedResearchErrorMessage } from '@/helpers/researchErrorMessage'
import { getResearchScientistOptions } from '@/helpers/researchScientists'
import { getServerSession } from '@/lib/auth/server'
import { getResearchWorkspaceAccess } from '@/requests/researchProjects'
import { CustomSession } from '@/types/auth'

export default async function ResearchProjectsCreatePage() {
  const session = await getServerSession()
  const t = await getTranslations('pages.Research')
  const result = await getResearchWorkspaceAccess(session as CustomSession)

  if ('error' in result) {
    return (
      <ResearchStateCard
        title={t('workspace.unavailableTitle')}
        description={getLocalizedResearchErrorMessage(result.error, t)}
      />
    )
  }

  const access = result.data

  if (!access.hasAccess) {
    return (
      <ResearchStateCard
        title={t('workspace.accessDeniedTitle')}
        description={t('workspace.accessDeniedDescription')}
      />
    )
  }

  const principalInvestigatorOptions = access.canCreateProjects
    ? (
        await Promise.all(
          access.companies.map(async (company) => {
            const scientists = await getResearchScientistOptions(session, company.id)

            return scientists.map((scientist) => ({
              ...scientist,
              companyId: company.id,
            }))
          })
        )
      ).flat()
    : []

  return (
    <div className="flex flex-col gap-md">
      <div>
        <h2 className="text-lg font-semibold text-textcolor-primary">{t('create.title')}</h2>
        <p className="mt-2 text-sm text-textcolor-secondary">{t('create.subtitle')}</p>
      </div>
      <CreateResearchProjectForm access={access} principalInvestigatorOptions={principalInvestigatorOptions} />
    </div>
  )
}
