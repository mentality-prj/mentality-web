import { redirect } from 'next/navigation'

import { Routes } from '@/constants/routes'
import { getServerSession } from '@/lib/get-server-session'
import { COMPANY_ROLES } from '@/types/rbac'

export default async function CompanyDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getServerSession()
  const companyRole = session?.user?.companyRole

  if (companyRole === COMPANY_ROLES.SUPERUSER) {
    redirect(`/${locale}${Routes.COMPANY_ADMIN}`)
  }

  if (companyRole === COMPANY_ROLES.MANAGER) {
    redirect(`/${locale}${Routes.COMPANY_MANAGER}`)
  }

  // Platform administration is not equivalent to company administration.
  if (session?.user?.role === 'admin') {
    redirect(`/${locale}${Routes.ADMIN}`)
  }

  redirect(`/${locale}`)
}
