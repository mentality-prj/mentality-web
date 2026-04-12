'use client'

import { ReactNode } from 'react'

import { AdminCompanyProvider } from '@/context/adminCompanyContext'

export function AdminLayoutProvider({ children }: { children: ReactNode }) {
  return <AdminCompanyProvider>{children}</AdminCompanyProvider>
}
