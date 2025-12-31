'use client'
import { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

const Layout = ({ children }: MainLayoutProps) => {
  return (
    <section className="flex w-full">
      <div className="content">{children}</div>
    </section>
  )
}

export default Layout
