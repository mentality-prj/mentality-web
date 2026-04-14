import { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { AdminHeader } from '@/admin/index'
import { LandingFooter } from '@/components/features/Landing'
import AdminMobileNavDrawer from '@/components/Layout/MobileNavDrawer/AdminMobileNavDrawer'
import { Sidebar } from '@/components/Layout/Sidebar'
import { adminSidebarMenu } from '@/constants/menu'
import { getServerSession } from '@/lib/get-server-session'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession()
  if (!session || !session.user || session.user.role !== 'admin') {
    redirect('/auth')
  }

  return (
    <div className="relative flex w-full flex-1 justify-center overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 flex h-full w-full">
        <div className="h-full w-1/2 bg-white" />
        <div className="admin-background h-full w-1/2" />
      </div>
      <div className="container-max-width relative z-10 flex min-h-screen w-full">
        <main className="paper flex flex-1 flex-col items-start justify-between max-md:px-4 md:pr-8">
          <div className="w-full">
            <div className="hidden md:block">
              <AdminHeader />
            </div>
            <div className="md:hidden">
              <AdminMobileNavDrawer />
            </div>
            {children}
          </div>
          <LandingFooter type="small" className="bg-none" />
        </main>
        <div className="admin-background hidden md:flex">
          <Sidebar menu={adminSidebarMenu} type="admin" />
        </div>
      </div>
    </div>
  )
}
