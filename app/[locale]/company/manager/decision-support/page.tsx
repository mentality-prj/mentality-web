import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { AdminCompanyWrapper } from '@/components/features/Company/AdminCompanyWrapper'
import { DecisionSupportWorkspace } from '@/components/features/Company/Manager/DecisionSupport/DecisionSupportWorkspace'
import { Routes } from '@/constants/routes'
import { PageTitle } from '@/ds/components/PageTitle'
import { getServerSession } from '@/lib/get-server-session'
import { getMyCompany } from '@/requests/companies'
import { COMPANY_ROLES } from '@/types/rbac'

export default async function ManagerDecisionSupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getServerSession()

  const isSystemAdmin = session?.user?.role === 'admin'

  if (!isSystemAdmin && session?.user?.companyRole !== COMPANY_ROLES.MANAGER) {
    redirect(`/${locale}${Routes.COMPANY}`)
  }

  const t = await getTranslations('pages.Company.manager')

  const companyResult = isSystemAdmin ? null : await getMyCompany(session)
  const subtitle = companyResult && !('error' in companyResult) ? companyResult.data.name : undefined

  let content: React.ReactNode

  if (isSystemAdmin) {
    content = (
      <AdminCompanyWrapper>
        <DecisionSupportWorkspace viewerRole="manager" />
      </AdminCompanyWrapper>
    )
  } else {
    content = <DecisionSupportWorkspace viewerRole="manager" />
  }

  return (
    <div className="gap-xl flex flex-col">
      <PageTitle title={t('decisionSupport.title')} subtitle={subtitle} />
      <section className="flex flex-col gap-md">{content}</section>
    </div>
  )
}
