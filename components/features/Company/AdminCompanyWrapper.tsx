'use client'

import { ReactNode } from 'react'

import { AdminCompanySelector } from '@/components/features/Company/AdminCompanySelector'
import { AdminCompanyProvider, useAdminCompany } from '@/context/adminCompanyContext'

function AdminCompanyContent({ children }: { children: ReactNode }) {
  const { isReady } = useAdminCompany()
  return (
    <>
      <AdminCompanySelector />
      {isReady ? children : null}
    </>
  )
}

export function AdminCompanyWrapper({ children }: { children: ReactNode }) {
  return (
    <AdminCompanyProvider>
      <AdminCompanyContent>{children}</AdminCompanyContent>
    </AdminCompanyProvider>
  )
}
