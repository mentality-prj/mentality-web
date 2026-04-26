import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { AdminCompanyWrapper } from '@/components/features/Company/AdminCompanyWrapper'
import { ManagerEmployeeTable } from '@/components/features/Company/Manager/EmployeeList/ManagerEmployeeTable'
import { Routes } from '@/constants/routes'
import { PageTitle } from '@/ds/components/PageTitle'
import { getServerSession } from '@/lib/get-server-session'
import { getMyCompany } from '@/requests/companies'
import { COMPANY_ROLES } from '@/types/rbac'

export default async function ManagerEmployeesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getServerSession()

  const isSystemAdmin = session?.user?.role === 'admin'

  if (!isSystemAdmin && session?.user?.companyRole !== COMPANY_ROLES.MANAGER) {
    redirect(`/${locale}${Routes.COMPANY}`)
  }

  const t = await getTranslations('pages.Company.manager')

  const result = isSystemAdmin ? { error: 'admin' } : await getMyCompany(session)
  const subtitle = !('error' in result) ? result.data.name : undefined

  const content = <ManagerEmployeeTable />

  return (
    <div className="gap-xl flex flex-col">
      <PageTitle title={t('employeesSection')} subtitle={subtitle} />
      {isSystemAdmin ? <AdminCompanyWrapper>{content}</AdminCompanyWrapper> : content}
    </div>
  )
}
