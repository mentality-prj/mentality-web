import { redirect } from 'next/navigation'

import { Routes } from '@/constants/routes'
import { getServerSession } from '@/lib/get-server-session'
import { COMPANY_ROLES } from '@/types/rbac'

export default async function ManagerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getServerSession()

  if (session?.user?.companyRole !== COMPANY_ROLES.MANAGER) {
    redirect(`/${locale}${Routes.COMPANY}`)
  }

  redirect(`/${locale}${Routes.COMPANY_MANAGER_INVITES}`)
}
