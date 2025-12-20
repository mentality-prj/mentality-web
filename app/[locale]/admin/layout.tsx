import { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { AdminSidebarMenu } from '@/components/Admin/AdminSidebarMenu'
import { LandingFooter, LandingHeader } from '@/components/Landing'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  if (!session || !session.user || session.user.role !== 'admin') {
    redirect('/signin')
  }
  return (
    <div className="admin-layout">
      <LandingHeader />
      <div className="leftmenu-layout min-h-screen">
        <aside>
          <AdminSidebarMenu />
        </aside>
        <main className="w-full">{children}</main>
      </div>
      <LandingFooter type="small" />
    </div>
  )
}
