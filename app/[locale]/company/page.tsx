import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { Routes } from '@/constants/routes'
import { COMPANY_ROLES } from '@/types/rbac'

// Redirect users to their panel based on company role
export default async function CompanyIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await auth()
  const role = session?.user?.companyRole

  if (session?.user?.role === 'admin') {
    redirect(`/${locale}${Routes.COMPANY_GLOBAL_ADMIN}`)
  }

  if (role === COMPANY_ROLES.SUPERUSER) {
    redirect(`/${locale}${Routes.COMPANY_ADMIN}`)
  }

  if (role === COMPANY_ROLES.MANAGER) {
    redirect(`/${locale}${Routes.COMPANY_MANAGER}`)
  }

  // EMPLOYEE or no role → back to home
  redirect(`/${locale}`)
}
