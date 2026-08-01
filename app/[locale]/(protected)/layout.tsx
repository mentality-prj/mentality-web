import { ReactNode } from 'react'
import { headers } from 'next/headers'

import { LandingFooter } from '@/components/features/Landing'
import { Header } from '@/components/Layout/Header'
import { mainVariants } from '@/components/Layout/mainVariants'
import ProtectedLayoutSegmentGate from '@/components/Layout/ProtectedLayoutSegmentGate'
import Sidebar from '@/components/Layout/Sidebar/Sidebar'
import { getUserSidebarMenu } from '@/constants/menu'
import { Routes } from '@/constants/routes'
import { requireServerSession } from '@/lib/auth/server'
import { cn } from '@/lib/utils'
import { getResearchWorkspaceAccess } from '@/requests/researchProjects'

function matchesDetachedPrefix(pathname: string, detachedPrefix: string): boolean {
  return pathname === detachedPrefix || pathname.startsWith(`${detachedPrefix}/`)
}

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await requireServerSession(`/${locale}${Routes.AUTH}`)

  const pathname = headers().get('x-pathname') || ''
  const localizedResearchPrefix = `/${locale}${Routes.RESEARCH}`

  if (matchesDetachedPrefix(pathname, localizedResearchPrefix)) {
    return children
  }

  const researchAccess = await getResearchWorkspaceAccess(session)
  const includeResearch = 'data' in researchAccess && researchAccess.data.hasAccess
  const sidebarMenu = getUserSidebarMenu({ includeResearch })

  const defaultContent = (
    <div className="relative flex w-full flex-1 justify-center">
      <div className="pointer-events-none absolute inset-0 z-0 flex h-full w-full">
        <div className="h-full w-1/2 bg-background" />
        <div className="h-full w-1/2 bg-background-alt" />
      </div>
      <div className="container-max-width relative z-10 flex w-full">
        <div className="hidden bg-white lg:flex">
          <Sidebar menu={sidebarMenu} />
        </div>
        <main className={cn(mainVariants())}>
          <div className="padded flex w-full flex-col gap-sm tablet:gap-6 sm:gap-md">
            <Header sidebarMenu={sidebarMenu} />
            {children}
          </div>
          <LandingFooter type="small" className="bg-none" />
        </main>
      </div>
    </div>
  )

  return (
    <ProtectedLayoutSegmentGate
      detachedPrefix={Routes.RESEARCH}
      detachedContent={children}
      defaultContent={defaultContent}
    />
  )
}
