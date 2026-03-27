import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { CreateCompanyForm } from '@/components/features/Company/GlobalAdmin/CreateCompanyForm'
import { Routes } from '@/constants/routes'
import { PageTitle } from '@/ds/components/PageTitle'
import { COMPANY_ROLES } from '@/types/rbac'

export default async function GlobalAdminPage() {
  const session = await auth()

  if (session?.user?.companyRole !== COMPANY_ROLES.GLOBAL_ADMIN) {
    redirect(Routes.COMPANY)
  }

  return (
    <div className="flex flex-col gap-lg">
      <PageTitle title="Global Admin" />

      <section className="flex flex-col gap-md">
        <h2 className="text-lg font-semibold">Create Company</h2>
        <div className="max-w-sm">
          <CreateCompanyForm />
        </div>
      </section>
    </div>
  )
}
