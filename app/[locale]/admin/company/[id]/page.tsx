import { ArrowLeft, Building2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { AssignManagerForm } from '@/components/features/Company/CompanyAdmin/AssignManager/AssignManagerForm'
import { EmployeeTable } from '@/components/features/Company/CompanyAdmin/EmployeeList/EmployeeTable'
import { InviteEmployeeForm } from '@/components/features/Company/CompanyAdmin/InviteEmployee/InviteEmployeeForm'
import { GroupTree } from '@/components/features/Company/CompanyAdmin/ManageGroups/GroupTree'
import { InviteList } from '@/components/features/Company/InviteList/InviteList'
import { Routes } from '@/constants/routes'
import { PageTitle } from '@/ds/components/PageTitle'
import { Link } from '@/i18n/navigation'
import { getCompanyById } from '@/requests/companies'

export default async function AdminCompanyDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { id } = await params
  const session = await auth()

  const result = await getCompanyById(session, id)
  if ('error' in result) notFound()

  const company = result.data
  const t = await getTranslations('pages.Company.globalAdmin.companyDetail')
  const tAdmin = await getTranslations('pages.Company.companyAdmin')

  return (
    <div className="gap-xl flex flex-col">
      <div className="flex flex-col gap-sm">
        <Link
          href={Routes.COMPANY_GLOBAL_ADMIN}
          className="hover:text-foreground flex w-fit items-center gap-1 text-sm text-textcolor-secondary transition-colors"
        >
          <ArrowLeft size={14} />
          {t('back')}
        </Link>

        <div className="flex items-center gap-sm">
          <Building2 size={22} className="shrink-0 text-textcolor-secondary" />
          <PageTitle title={company.name} />
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-textcolor-secondary">
          <span>
            {t('idLabel')}: <span className="font-mono">{company.id}</span>
          </span>
          <span>
            {t('createdLabel')}: {new Date(company.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <section className="flex flex-col gap-md">
        <h2 className="text-lg font-semibold">{tAdmin('groups.title')}</h2>
        <GroupTree />
      </section>

      <section className="flex flex-col gap-md">
        <h2 className="text-lg font-semibold">{tAdmin('employees.title')}</h2>
        <EmployeeTable />
      </section>

      <section className="flex flex-col gap-md">
        <h2 className="text-lg font-semibold">{tAdmin('invite.title')}</h2>
        <div className="max-w-md">
          <InviteEmployeeForm />
        </div>
      </section>

      <section className="flex flex-col gap-md">
        <h2 className="text-lg font-semibold">{tAdmin('assignManager.title')}</h2>
        <div className="max-w-md">
          <AssignManagerForm />
        </div>
      </section>

      <section className="flex flex-col gap-md">
        <h2 className="text-lg font-semibold">{tAdmin('invitesSection')}</h2>
        <InviteList />
      </section>
    </div>
  )
}
