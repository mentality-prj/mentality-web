import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { AssignManagerForm } from '@/components/features/Company/CompanyAdmin/AssignManager/AssignManagerForm'
import { EmployeeTable } from '@/components/features/Company/CompanyAdmin/EmployeeList/EmployeeTable'
import { InviteEmployeeForm } from '@/components/features/Company/CompanyAdmin/InviteEmployee/InviteEmployeeForm'
import { GroupTree } from '@/components/features/Company/CompanyAdmin/ManageGroups/GroupTree'
import { InviteList } from '@/components/features/Company/InviteList/InviteList'
import { Routes } from '@/constants/routes'
import { PageTitle } from '@/ds/components/PageTitle'
import { COMPANY_ROLES } from '@/types/rbac'

export default async function CompanyAdminPage() {
  const session = await auth()

  if (session?.user?.companyRole !== COMPANY_ROLES.COMPANY_ADMIN) {
    redirect(Routes.COMPANY)
  }

  return (
    <div className="gap-xl flex flex-col">
      <PageTitle title="Company Admin" />

      <section className="flex flex-col gap-md">
        <h2 className="text-lg font-semibold">Manage Groups</h2>
        <GroupTree />
      </section>

      <section className="flex flex-col gap-md">
        <h2 className="text-lg font-semibold">Employees</h2>
        <EmployeeTable />
      </section>

      <section className="flex flex-col gap-md">
        <h2 className="text-lg font-semibold">Invite Employee</h2>
        <div className="max-w-md">
          <InviteEmployeeForm />
        </div>
      </section>

      <section className="flex flex-col gap-md">
        <h2 className="text-lg font-semibold">Assign Manager Access</h2>
        <div className="max-w-md">
          <AssignManagerForm />
        </div>
      </section>

      <section className="flex flex-col gap-md">
        <h2 className="text-lg font-semibold">Invites</h2>
        <InviteList />
      </section>
    </div>
  )
}
