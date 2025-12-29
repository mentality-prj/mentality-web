import { ReactNode } from 'react'
import { headers } from 'next/headers'

import { Header } from '@/components/Header'
import { LandingFooter } from '@/components/Landing'
import Sidebar from '@/components/Sidebar/Sidebar'
import { userSidebarMenu } from '@/constants/sidebarMenu'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const pathname = headers().get('x-pathname') || '/'

  return (
    <div className="relative flex w-full flex-1 justify-center">
      <div className="pointer-events-none absolute inset-0 z-0 flex h-full w-full">
        <div className="bg-background h-full w-1/2" />
        <div className="bg-background-alt h-full w-1/2" />
      </div>
      <div className="container-max-width relative z-10 flex w-full">
        <div className="flex bg-white">
          <Sidebar menu={userSidebarMenu} pathname={pathname} />
        </div>
        <main className="old-paper min-h-screen flex-1 flex-col items-start justify-between">
          <div className="padded flex flex-col gap-8">
            <Header pathname={pathname} />
            {children}
          </div>
          <LandingFooter type="small" className="bg-none" />
        </main>
      </div>
    </div>
  )
}
