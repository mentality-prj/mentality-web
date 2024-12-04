import { ReactNode } from 'react'

import { Layout } from '@/components/ui/layout/layout'

import '@/styles/globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return <Layout>{children}</Layout>
}
