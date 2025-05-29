'use client'
import { ReactNode } from 'react'

import Content from '@/components/wrappers/Content'

import SidebarWrapper from '../Sidebar'

interface MainLayoutProps {
  children: ReactNode
}

const Layout = ({ children }: MainLayoutProps) => {
  return (
    <section className="flex">
      <SidebarWrapper>
        <Content>{children}</Content>
      </SidebarWrapper>
    </section>
  )
}

export default Layout
