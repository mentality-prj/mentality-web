'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthProvider'

import { useAdminCompany } from '@/context/adminCompanyContext'
import { getCompanies } from '@/requests/companies'
import { CustomSession } from '@/types/auth'
import { CompanyEntity } from '@/types/company'

const STORAGE_KEY = 'adminSelectedCompanyId'

export function useCompanySelector() {
  const { session: data, status } = useAuth()
  const { companyId, setCompanyId } = useAdminCompany()
  const [companies, setCompanies] = useState<CompanyEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCompanies = useCallback(async () => {
    setLoading(true)
    setError(null)
    const session = data as CustomSession
    const res = await getCompanies(session)
    if ('error' in res) {
      setError(res.error)
    } else {
      setCompanies(res.data)
    }
    setLoading(false)
  }, [data])

  useEffect(() => {
    if (status === 'authenticated') fetchCompanies()
    else if (status === 'unauthenticated') {
      setCompanies([])
      setCompanyId(null)
      setError(null)
      setLoading(false)
    }
  }, [status, fetchCompanies, setCompanyId])

  useEffect(() => {
    if (!companyId && companies.length > 0) {
      const stored = localStorage.getItem(STORAGE_KEY)
      const isValid = stored && companies.some((c) => c.id === stored)
      const chosen = isValid ? stored : companies[0].id
      localStorage.setItem(STORAGE_KEY, chosen)
      setCompanyId(chosen)
    }
  }, [companyId, companies, setCompanyId])

  const handleSetCompanyId = useCallback(
    (id: string | null) => {
      if (id) {
        localStorage.setItem(STORAGE_KEY, id)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
      setCompanyId(id)
    },
    [setCompanyId]
  )

  return { companies, companyId, setCompanyId: handleSetCompanyId, loading, error }
}
