'use client'
import { ReactNode } from 'react'

import Content from '@/components/wrappers/Content'

interface MainLayoutProps {
  children: ReactNode
}

const Layout = ({ children }: MainLayoutProps) => {
  return (
    <section className="flex w-full">
      <Content>{children}</Content>
    </section>
  )
}

export default Layout
