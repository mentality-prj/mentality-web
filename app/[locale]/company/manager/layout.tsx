import { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { AdminLayoutProvider } from '@/components/features/Company/AdminLayoutProvider'
import { LandingFooter } from '@/components/features/Landing'
import { CompanyHeader } from '@/components/Layout/Header/CompanyHeader'
import { mainVariants } from '@/components/Layout/mainVariants'
import Sidebar from '@/components/Layout/Sidebar/Sidebar'
import { companyManagerSidebarMenu } from '@/constants/menu'
import { Routes } from '@/constants/routes'
import { getServerSession } from '@/lib/get-server-session'
import { COMPANY_ROLES } from '@/types/rbac'

export default async function CompanyManagerLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await getServerSession()
  if (session?.user?.role === 'admin') {
    redirect(`/${locale}${Routes.ADMIN}`)
  }
  if (!session?.user?.companyId || session.user.companyRole !== COMPANY_ROLES.MANAGER) {
    redirect(`/${locale}${Routes.COMPANY}`)
  }

  return (
    <AdminLayoutProvider>
      <div className="relative flex w-full flex-1 justify-center">
        <div className="pointer-events-none absolute inset-0 z-0 flex h-full w-full">
          <div className="h-full w-1/2 bg-background" />
          <div className="h-full w-1/2 bg-background-alt" />
        </div>
        <div className="container-max-width relative z-10 flex w-full">
          <div className="hidden bg-white/80 backdrop-blur lg:flex">
            <Sidebar menu={companyManagerSidebarMenu} />
          </div>
          <main className={mainVariants()}>
            <div className="padded flex w-full flex-col gap-md">
              <CompanyHeader menu={companyManagerSidebarMenu} />
              {children}
            </div>
            <LandingFooter type="small" className="bg-none" />
          </main>
        </div>
      </div>
    </AdminLayoutProvider>
  )
}
