'use client'

import { ReactNode } from 'react'

import { AdminCompanySelector } from '@/components/features/Company/AdminCompanySelector'
import { AdminCompanyProvider } from '@/context/adminCompanyContext'

export function AdminCompanyWrapper({ children }: { children: ReactNode }) {
  return (
    <AdminCompanyProvider>
      <AdminCompanySelector />
      {children}
    </AdminCompanyProvider>
  )
}
