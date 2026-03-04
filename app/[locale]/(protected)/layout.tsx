import { ReactNode } from 'react'
import Script from 'next/script'

import { LandingFooter } from '@/components/features/Landing'
import { Header } from '@/components/Layout/Header'
import Sidebar from '@/components/Layout/Sidebar/Sidebar'
import { userSidebarMenu } from '@/constants/menu'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex w-full flex-1 justify-center">
      <div className="pointer-events-none absolute inset-0 z-0 flex h-full w-full">
        <div className="h-full w-1/2 bg-background" />
        <div className="h-full w-1/2 bg-background-alt" />
      </div>
      <div className="container-max-width relative z-10 flex w-full">
        <div className="hidden bg-white md:flex">
          <Sidebar menu={userSidebarMenu} />
        </div>
        <main className="old-paper min-h-screen w-full flex-1 flex-col items-start justify-between">
          <div className="padded flex w-full flex-col gap-md">
            <Header />
            {children}
          </div>
          <LandingFooter type="small" className="bg-none" />
        </main>
      </div>
      <Script src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`} />
    </div>
  )
}
