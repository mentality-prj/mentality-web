import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { AdminCompanyWrapper } from '@/components/features/Company/AdminCompanyWrapper'
import { InviteEmployeeFormModal } from '@/components/features/Company/CompanyAdmin/InviteEmployee/InviteEmployeeFormModal'
import { InviteList } from '@/components/features/Company/InviteList/InviteList'
import { Routes } from '@/constants/routes'
import { PageTitle } from '@/ds/components/PageTitle'
import { getMyCompany } from '@/requests/companies'
import { COMPANY_ROLES } from '@/types/rbac'

export default async function CompanyAdminInvitesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await auth()

  const isSystemAdmin = session?.user?.role === 'admin'

  if (!isSystemAdmin && session?.user?.companyRole !== COMPANY_ROLES.SUPERUSER) {
    redirect(`/${locale}${Routes.COMPANY}`)
  }

  const t = await getTranslations('pages.Company.companyAdmin')

  const result = isSystemAdmin ? { error: 'admin' } : await getMyCompany(session)
  const subtitle = !('error' in result) ? result.data.name : undefined

  const content = (
    <div className="flex flex-col gap-md">
      <div className="flex justify-end">
        <InviteEmployeeFormModal />
      </div>
      <InviteList />
    </div>
  )

  return (
    <div className="gap-xl flex flex-col">
      <PageTitle title={t('invitesSection')} subtitle={subtitle} />
      {isSystemAdmin ? <AdminCompanyWrapper>{content}</AdminCompanyWrapper> : content}
    </div>
  )
}
