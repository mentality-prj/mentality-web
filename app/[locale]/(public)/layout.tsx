import { ReactNode } from 'react'

import { LandingFooter, LandingHeader } from '@/components/features/Landing'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen w-full flex-col justify-between bg-white">
      <LandingHeader />
      <div className="flex-1">{children}</div>
      <LandingFooter />
    </main>
  )
}
