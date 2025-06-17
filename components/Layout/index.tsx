'use client'
import { ReactNode } from 'react'

import Content from '@/components/wrappers/Content'

import SidebarWrapper from '../Sidebar'

interface MainLayoutProps {
  children: ReactNode
}

const Layout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarWrapper>
      <section className="flex w-full">
        <Content>{children}</Content>
      </section>
    </SidebarWrapper>
  )
}

export default Layout
