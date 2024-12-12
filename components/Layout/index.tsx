'use client'
import { ReactNode } from 'react'

import NavbarWrapper from '@/components/Navbar'
import Content from '@/components/wrappers/Content'

interface MainLayoutProps {
  children: ReactNode
}

const Layout = ({ children }: MainLayoutProps) => {
  return (
    <section className="flex">
      <NavbarWrapper>
        <Content>{children}</Content>
      </NavbarWrapper>
    </section>
  )
}

export default Layout
