import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { Routes } from '@/constants/routes'
import { COMPANY_ROLES } from '@/types/rbac'

export default async function CompanyAdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await auth()

  const isSystemAdmin = session?.user?.role === 'admin'

  if (!isSystemAdmin && session?.user?.companyRole !== COMPANY_ROLES.SUPERUSER) {
    redirect(`/${locale}${Routes.COMPANY}`)
  }

  redirect(`/${locale}${Routes.COMPANY_ADMIN_EMPLOYEES}`)
}
