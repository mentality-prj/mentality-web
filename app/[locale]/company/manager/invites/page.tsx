import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { AdminCompanyWrapper } from '@/components/features/Company/AdminCompanyWrapper'
import { InviteListFilter } from '@/components/features/Company/InviteList/InviteListFilter'
import { InviteManagerFormModal } from '@/components/features/Company/Manager/InviteManagerFormModal'
import { Routes } from '@/constants/routes'
import { PageTitle } from '@/ds/components/PageTitle'
import { getMyCompany } from '@/requests/companies'
import { COMPANY_ROLES } from '@/types/rbac'

export default async function ManagerInvitesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await auth()

  const isSystemAdmin = session?.user?.role === 'admin'

  if (!isSystemAdmin && session?.user?.companyRole !== COMPANY_ROLES.MANAGER) {
    redirect(`/${locale}${Routes.COMPANY}`)
  }

  const t = await getTranslations('pages.Company.manager')

  const result = isSystemAdmin ? { error: 'admin' } : await getMyCompany(session)
  const subtitle = !('error' in result) ? result.data.name : undefined

  const content = (
    <div className="flex flex-col gap-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('invitesSection')}</h2>
        <InviteManagerFormModal />
      </div>

      <InviteListFilter />
    </div>
  )

  return (
    <div className="gap-xl flex flex-col">
      <PageTitle title={t('title')} subtitle={subtitle} />

      {isSystemAdmin ? <AdminCompanyWrapper>{content}</AdminCompanyWrapper> : content}
    </div>
  )
}

