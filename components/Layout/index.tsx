'use client'
import { ReactNode } from 'react'

import { NavbarWrapper } from '@/components/Navbar'

interface MainLayoutProps {
  children: ReactNode
}

const Layout = ({ children }: MainLayoutProps) => {
  return (
    <section className="flex">
      <NavbarWrapper>{children}</NavbarWrapper>
    </section>
  )
}

export default Layout
