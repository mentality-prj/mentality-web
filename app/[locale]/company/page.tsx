import { redirect } from 'next/navigation'

import { Routes } from '@/constants/routes'
import { getServerSession } from '@/lib/get-server-session'
import { COMPANY_ROLES } from '@/types/rbac'

export default async function CompanyDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getServerSession()
  // A platform admin is not a B2B superuser, even if a legacy session
  // happens to carry both identities.
  if (session?.user?.role === 'admin') {
    redirect(`/${locale}${Routes.ADMIN}`)
  }

  if (!session?.user) {
    redirect(`/${locale}/auth`)
  }

  const companyRole = session?.user?.companyId ? session.user.companyRole : undefined
  if (companyRole === COMPANY_ROLES.SUPERUSER) {
    redirect(`/${locale}${Routes.COMPANY_ADMIN}`)
  }

  if (companyRole === COMPANY_ROLES.MANAGER) {
    redirect(`/${locale}${Routes.COMPANY_MANAGER}`)
  }

  if (!session?.user?.companyId || !session.user.companyRole) {
    redirect(`/${locale}/select-company`)
  }

  redirect(`/${locale}`)
}
