import { ReactNode } from 'react'

import { Header } from '@/components/Header/Header'
import Layout from '@/components/Layout'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <Layout>
      <Header />
      {children}
    </Layout>
  )
}
