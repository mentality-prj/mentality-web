import { ReactNode } from 'react'

import { LandingFooter, LandingHeader } from '@/components/Landing'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <main className="background flex min-h-screen w-full flex-col justify-between">
      <LandingHeader />
      <div className="flex-1">{children}</div>
      <LandingFooter />
    </main>
  )
}
