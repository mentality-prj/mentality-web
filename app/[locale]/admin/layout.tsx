import { ReactNode } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { AdminHeader } from '@/components/Admin'

import { Sidebar } from '../../../components/Sidebar'
import { adminSidebarMenu } from '../../../constants/sidebarMenu'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  if (!session || !session.user || session.user.role !== 'admin') {
    redirect('/signin')
  }

  const pathname = headers().get('x-pathname') || '/admin'

  return (
    <div className="relative flex w-full flex-1 justify-center">
      <div className="pointer-events-none absolute inset-0 z-0 flex h-full w-full">
        <div className="h-full w-1/2 bg-white" />
        <div className="admin-background h-full w-1/2" />
      </div>
      <div className="container-max-width relative z-10 flex min-h-screen w-full">
        <main className="paper flex-1 flex-col items-start pr-8">
          <AdminHeader pathname={pathname} />
          {children}
        </main>
        <div className="admin-background flex">
          <Sidebar pathname={pathname} menu={adminSidebarMenu} type="admin" />
        </div>
      </div>
    </div>
  )
}
