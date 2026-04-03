import { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
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
  const session = await auth()

  if (!session?.user) {
    redirect(`/${locale}/signin`)
  }

  const isSystemAdmin = session.user.role === 'admin'
  const companyRole = session.user.companyRole
  if (!isSystemAdmin && (!companyRole || !ALLOWED_ROLES.includes(companyRole))) {
    redirect(`/${locale}`)
  }

  return <>{children}</>
}
