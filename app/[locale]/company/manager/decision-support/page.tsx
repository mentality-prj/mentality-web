import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { DecisionSupportWorkspace } from '@/components/features/Company/Manager/DecisionSupport/DecisionSupportWorkspace'
import { Routes } from '@/constants/routes'
import { PageTitle } from '@/ds/components/PageTitle'
import { getServerSession } from '@/lib/get-server-session'
import { getMyCompany } from '@/requests/companies'
import { COMPANY_ROLES } from '@/types/rbac'

export default async function ManagerDecisionSupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getServerSession()

  // Leaf authorization is mandatory even when parent App Router layouts are cached.
  if (session?.user?.role === 'admin') {
    redirect(`/${locale}${Routes.ADMIN}`)
  }
  if (!session?.user?.companyId || session.user.companyRole !== COMPANY_ROLES.MANAGER) {
    redirect(`/${locale}${Routes.COMPANY}`)
  }

  const t = await getTranslations('pages.Company.manager')

  const companyResult = await getMyCompany(session)
  const subtitle = !('error' in companyResult) ? companyResult.data.name : undefined
  const content = <DecisionSupportWorkspace viewerRole="manager" />

  return (
    <div className="gap-xl flex flex-col">
      <PageTitle title={t('decisionSupport.title')} subtitle={subtitle} />
      <section className="flex flex-col gap-md">{content}</section>
    </div>
  )
}
