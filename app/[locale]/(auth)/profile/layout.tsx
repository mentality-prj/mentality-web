'use client'
import { ReactNode } from 'react'

import { SignOutButton } from '@/components/Buttons'

interface MainLayoutProps {
  children: ReactNode
}

const Layout = ({ children }: MainLayoutProps) => {
  return (
    <section className="mt-12 flex flex-col items-center gap-10">
      {children}
      <SignOutButton />
    </section>
  )
}

export default Layout
