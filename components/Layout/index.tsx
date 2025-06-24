'use client'
import { ReactNode } from 'react'

import Content from '@/components/wrappers/Content'
import { HamburgerMenu } from '@/ds/icons/hamburger-menu'
import { Button } from '@/ds/shadcn/button'
import { useSidebar } from '@/ds/shadcn/sidebar'

import SidebarWrapper from '../Sidebar'

interface MainLayoutProps {
  children: ReactNode
}

const Layout = ({ children }: MainLayoutProps) => {
  const { isMobile, toggleSidebar } = useSidebar()
  return (
    <SidebarWrapper>
      <section className="flex w-full">
        {isMobile && (
          <Button className="absolute left-3 top-3 h-6 w-6" onClick={toggleSidebar} variant="iconButton" size="icon">
            <HamburgerMenu />
          </Button>
        )}
        <Content>{children}</Content>
      </section>
    </SidebarWrapper>
  )
}

export default Layout
