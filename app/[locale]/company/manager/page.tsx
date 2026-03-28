import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { InviteList } from '@/components/features/Company/InviteList/InviteList'
import { AnalyticsView } from '@/components/features/Company/Manager/AnalyticsView'
import { InviteEmployeeManagerForm } from '@/components/features/Company/Manager/InviteEmployeeManagerForm'
import { Routes } from '@/constants/routes'
import { PageTitle } from '@/ds/components/PageTitle'
import { getMyCompany } from '@/requests/companies'
import { COMPANY_ROLES } from '@/types/rbac'

export default async function ManagerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await auth()

  if (session?.user?.companyRole !== COMPANY_ROLES.MANAGER) {
    redirect(`/${locale}${Routes.COMPANY}`)
  }

  const t = await getTranslations('pages.Company.manager')

  const result = await getMyCompany(session)
  const subtitle = !('error' in result) ? result.data.name : undefined

  return (
    <div className="gap-xl flex flex-col">
      <PageTitle title={t('title')} subtitle={subtitle} />

      <section className="flex flex-col gap-md">
        <h2 className="text-lg font-semibold">{t('invite.title')}</h2>
        <div className="max-w-md">
          <InviteEmployeeManagerForm />
        </div>
      </section>

      <section className="flex flex-col gap-md">
        <h2 className="text-lg font-semibold">{t('invitesSection')}</h2>
        <InviteList />
      </section>

      <section className="flex flex-col gap-md">
        <h2 className="text-lg font-semibold">{t('analytics.title')}</h2>
        <AnalyticsView />
      </section>
    </div>
  )
}
