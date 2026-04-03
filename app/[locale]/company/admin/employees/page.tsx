import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { AdminCompanyWrapper } from '@/components/features/Company/AdminCompanyWrapper'
import { AssignManagerForm } from '@/components/features/Company/CompanyAdmin/AssignManager/AssignManagerForm'
import { EmployeeTable } from '@/components/features/Company/CompanyAdmin/EmployeeList/EmployeeTable'
import { InviteEmployeeForm } from '@/components/features/Company/CompanyAdmin/InviteEmployee/InviteEmployeeForm'
import { InviteList } from '@/components/features/Company/InviteList/InviteList'
import { Routes } from '@/constants/routes'
import { PageTitle } from '@/ds/components/PageTitle'
import { getMyCompany } from '@/requests/companies'
import { COMPANY_ROLES } from '@/types/rbac'

export default async function CompanyAdminEmployeesPage({ params }: { params: Promise<{ locale: string }> }) {
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
    <>
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
    </>
  )

  return (
    <div className="gap-xl flex flex-col">
      <PageTitle title={t('employees.title')} subtitle={subtitle} />

      {isSystemAdmin ? <AdminCompanyWrapper>{content}</AdminCompanyWrapper> : content}
    </div>
  )
}
