import { ReactNode } from 'react'

import { AdminCompanySelector } from '@/components/features/Company/AdminCompanySelector'
import { AdminLayoutProvider } from '@/components/features/Company/AdminLayoutProvider'
import { LandingFooter } from '@/components/features/Landing'
import { CompanyHeader } from '@/components/Layout/Header/CompanyHeader'
import Sidebar from '@/components/Layout/Sidebar/Sidebar'
import { companyManagerSidebarMenu } from '@/constants/menu'
import { getServerSession } from '@/lib/get-server-session'

export default async function CompanyManagerLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession()
  const isSystemAdmin = session?.user?.role === 'admin'
  const extra = isSystemAdmin ? <AdminCompanySelector /> : undefined

  return (
    <AdminLayoutProvider>
      <div className="relative flex w-full flex-1 justify-center">
        <div className="pointer-events-none absolute inset-0 z-0 flex h-full w-full">
          <div className="h-full w-1/2 bg-background" />
          <div className="h-full w-1/2 bg-background-alt" />
        </div>
        <div className="container-max-width relative z-10 flex w-full">
          <div className="hidden bg-white md:flex">
            <Sidebar menu={companyManagerSidebarMenu} extra={extra} />
          </div>
          <main className="old-paper min-h-screen w-full flex-1 flex-col items-start justify-between">
            <div className="padded flex w-full flex-col gap-md">
              <CompanyHeader menu={companyManagerSidebarMenu} extra={extra} />
              {children}
            </div>
            <LandingFooter type="small" className="bg-none" />
          </main>
        </div>
      </div>
    </AdminLayoutProvider>
  )
}
