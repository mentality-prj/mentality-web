import { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'

import { LandingFooter } from '@/components/features/Landing'
import { ResearchStateCard } from '@/components/features/Research/ResearchStateCard'
import { CompanyHeader } from '@/components/Layout/Header/CompanyHeader'
import { mainVariants } from '@/components/Layout/mainVariants'
import Sidebar from '@/components/Layout/Sidebar/Sidebar'
import { getResearchSidebarMenu } from '@/constants/menu'
import { PageTitle } from '@/ds/components/PageTitle'
import { getLocalizedResearchErrorMessage } from '@/helpers/researchErrorMessage'
import { getServerSession } from '@/lib/auth/server'
import { getResearchWorkspaceAccess } from '@/requests/researchProjects'

export default async function ResearchLayout({ children }: { children: ReactNode }) {
  const t = await getTranslations('pages.Research')
  const session = await getServerSession()
  const result = await getResearchWorkspaceAccess(session)
  const hasAccess = 'data' in result && result.data.hasAccess
  const includeCreate = 'data' in result ? result.data.canCreateProjects : false
  const menu = getResearchSidebarMenu({ includeCreate })

  const content =
    'error' in result ? (
      <ResearchStateCard
        title={t('workspace.unavailableTitle')}
        description={getLocalizedResearchErrorMessage(result.error, t)}
      />
    ) : hasAccess ? (
      children
    ) : (
      <ResearchStateCard
        title={t('workspace.accessDeniedTitle')}
        description={t('workspace.accessDeniedDescription')}
      />
    )

  const researchBackground = 'hsl(var(--background-muted))'

  return (
    <div className="relative flex w-full flex-1 justify-center">
      <div className="pointer-events-none absolute inset-0 z-0 flex h-full w-full">
        <div className="h-full w-full lg:hidden" style={{ background: researchBackground }} />
        <div className="hidden h-full w-[23rem] bg-white lg:block" />
        <div className="hidden h-full flex-1 lg:block" style={{ background: researchBackground }} />
      </div>
      <div className="container-max-width relative z-10 flex w-full">
        <div className="hidden bg-white/80 backdrop-blur lg:flex">
          <Sidebar menu={menu} />
        </div>
        <main className={mainVariants()} style={{ background: researchBackground }}>
          <div className="padded flex w-full flex-col gap-md">
            <CompanyHeader menu={menu} />
            <PageTitle title={t('header.title')} />
            <p className="text-sm text-textcolor-secondary">{t('header.subtitle')}</p>
            {content}
          </div>
          <LandingFooter type="small" className="bg-none" />
        </main>
      </div>
    </div>
  )
}
