'use client'

import { ReactNode } from 'react'

import { useAdminCompany } from '@/context/adminCompanyContext'

export function AdminCompanyWrapper({ children }: { children: ReactNode }) {
  const { isReady } = useAdminCompany()
  return isReady ? <>{children}</> : null
}

