'use client'

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'

type AdminCompanyContextValue = {
  companyId: string | null
  isReady: boolean
  setCompanyId: (id: string | null) => void
}

const AdminCompanyContext = createContext<AdminCompanyContextValue | null>(null)

export function AdminCompanyProvider({ children }: { children: ReactNode }) {
  const [companyId, setCompanyIdState] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  const setCompanyId = useCallback((id: string | null) => {
    setCompanyIdState(id)
    setIsReady(id !== null)
  }, [])

  const value = useMemo(() => ({ companyId, isReady, setCompanyId }), [companyId, isReady, setCompanyId])

  return <AdminCompanyContext.Provider value={value}>{children}</AdminCompanyContext.Provider>
}

export function useAdminCompany(): AdminCompanyContextValue {
  const ctx = useContext(AdminCompanyContext)
  if (!ctx) return { companyId: null, isReady: false, setCompanyId: () => {} }
  return ctx
}
