import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { AssignManagerForm } from '@/components/features/Company/CompanyAdmin/AssignManager/AssignManagerForm'
import { EmployeeTable } from '@/components/features/Company/CompanyAdmin/EmployeeList/EmployeeTable'
import { InviteEmployeeForm } from '@/components/features/Company/CompanyAdmin/InviteEmployee/InviteEmployeeForm'
import { GroupTree } from '@/components/features/Company/CompanyAdmin/ManageGroups/GroupTree'
import { InviteList } from '@/components/features/Company/InviteList/InviteList'
import { Routes } from '@/constants/routes'
import { PageTitle } from '@/ds/components/PageTitle'
import { getMyCompany } from '@/requests/companies'
import { COMPANY_ROLES } from '@/types/rbac'

export default async function CompanyAdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await auth()

  if (session?.user?.companyRole !== COMPANY_ROLES.SUPERUSER) {
    redirect(`/${locale}${Routes.COMPANY}`)
  }

  const t = await getTranslations('pages.Company.companyAdmin')

  const result = await getMyCompany(session)
  const subtitle = !('error' in result) ? result.data.name : undefined

  return (
    <div className="gap-xl flex flex-col">
      <PageTitle title={t('title')} subtitle={subtitle} />

      <section className="flex flex-col gap-md">
        <h2 className="text-lg font-semibold">{t('groups.title')}</h2>
        <GroupTree />
      </section>

      <section className="flex flex-col gap-md">
        <h2 className="text-lg font-semibold">{t('employees.title')}</h2>
        <EmployeeTable />
      </section>

      <section className="flex flex-col gap-md">
        <h2 className="text-lg font-semibold">{t('invite.title')}</h2>
        <div className="max-w-md">
          <InviteEmployeeForm />
        </div>
      </section>

      <section className="flex flex-col gap-md">
        <h2 className="text-lg font-semibold">{t('assignManager.title')}</h2>
        <div className="max-w-md">
          <AssignManagerForm />
        </div>
      </section>

      <section className="flex flex-col gap-md">
        <h2 className="text-lg font-semibold">{t('invitesSection')}</h2>
        <InviteList />
      </section>
    </div>
  )
}
