import { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { LandingFooter } from '@/components/features/Landing'
import { Header } from '@/components/Layout/Header'
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

  return (
    <div className="relative flex w-full flex-1 justify-center">
      <div className="pointer-events-none absolute inset-0 z-0 flex h-full w-full">
        <div className="h-full w-1/2 bg-background" />
        <div className="h-full w-1/2 bg-background-alt" />
      </div>
      <div className="container-max-width relative z-10 flex w-full">
        <main className="old-paper min-h-screen w-full flex-1 flex-col items-start justify-between">
          <div className="padded flex w-full flex-col gap-md">
            <Header />
            {children}
          </div>
          <LandingFooter type="small" className="bg-none" />
        </main>
      </div>
    </div>
  )
}
