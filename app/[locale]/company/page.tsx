import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { Routes } from '@/constants/routes'
import { COMPANY_ROLES } from '@/types/rbac'

// Redirect users to their panel based on company role
export default async function CompanyIndexPage() {
  const session = await auth()
  const role = session?.user?.companyRole

  if (role === COMPANY_ROLES.GLOBAL_ADMIN) {
    redirect(Routes.COMPANY_GLOBAL_ADMIN)
  }

  if (role === COMPANY_ROLES.COMPANY_ADMIN) {
    redirect(Routes.COMPANY_ADMIN)
  }

  if (role === COMPANY_ROLES.MANAGER) {
    redirect(Routes.COMPANY_MANAGER)
  }

  // EMPLOYEE or no role → back to home
  redirect(Routes.MAIN)
}
