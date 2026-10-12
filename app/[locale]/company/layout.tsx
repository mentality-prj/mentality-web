import { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { getServerSession } from '@/lib/get-server-session'
import { Routes } from '@/constants/routes'
import { COMPANY_ROLES } from '@/types/rbac'

const ALLOWED_ROLES = Object.values(COMPANY_ROLES)

export default async function CompanyLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await getServerSession()

  if (!session?.user) {
    redirect(`/${locale}/auth`)
  }

  const companyRole = session.user.companyRole
  if (!companyRole && session.user.role === 'admin') {
    redirect(`/${locale}${Routes.ADMIN}`)
  }
  if (!companyRole || !ALLOWED_ROLES.includes(companyRole)) {
    redirect(`/${locale}`)
  }

  return <>{children}</>
}
