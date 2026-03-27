import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { InviteList } from '@/components/features/Company/InviteList/InviteList'
import { AnalyticsView } from '@/components/features/Company/Manager/AnalyticsView'
import { InviteEmployeeManagerForm } from '@/components/features/Company/Manager/InviteEmployeeManagerForm'
import { Routes } from '@/constants/routes'
import { PageTitle } from '@/ds/components/PageTitle'
import { COMPANY_ROLES } from '@/types/rbac'

export default async function ManagerPage() {
  const session = await auth()

  if (session?.user?.companyRole !== COMPANY_ROLES.MANAGER) {
    redirect(Routes.COMPANY)
  }

  return (
    <div className="gap-xl flex flex-col">
      <PageTitle title="Manager Dashboard" />

      <section className="flex flex-col gap-md">
        <h2 className="text-lg font-semibold">Invite Employee</h2>
        <div className="max-w-md">
          <InviteEmployeeManagerForm />
        </div>
      </section>

      <section className="flex flex-col gap-md">
        <h2 className="text-lg font-semibold">Invites</h2>
        <InviteList />
      </section>

      <section className="flex flex-col gap-md">
        <h2 className="text-lg font-semibold">Analytics</h2>
        <AnalyticsView />
      </section>
    </div>
  )
}
