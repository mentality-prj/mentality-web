import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { InviteEmployeeFormModal } from '@/components/features/Company/CompanyAdmin/InviteEmployee/InviteEmployeeFormModal'
import { InviteListFilter } from '@/components/features/Company/InviteList/InviteListFilter'
import { Routes } from '@/constants/routes'
import { PageTitle } from '@/ds/components/PageTitle'
import { getServerSession } from '@/lib/get-server-session'
import { getMyCompany } from '@/requests/companies'
import { COMPANY_ROLES } from '@/types/rbac'

export default async function CompanyAdminInvitesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getServerSession()

  // Leaf authorization is mandatory even when parent App Router layouts are cached.
  if (session?.user?.role === 'admin') {
    redirect(`/${locale}${Routes.ADMIN}`)
  }
  if (!session?.user?.companyId || session.user.companyRole !== COMPANY_ROLES.SUPERUSER) {
    redirect(`/${locale}${Routes.COMPANY}`)
  }

  const t = await getTranslations('pages.Company.companyAdmin')

  const result = await getMyCompany(session)
  const subtitle = !('error' in result) ? result.data.name : undefined

  const content = (
    <div className="flex flex-col gap-sm">
      <div className="flex justify-end">
        <InviteEmployeeFormModal />
      </div>
      <InviteListFilter />
    </div>
  )

  return (
    <div className="gap-xl flex flex-col">
      <PageTitle title={t('invitesSection')} subtitle={subtitle} />
      {content}
    </div>
  )
}
