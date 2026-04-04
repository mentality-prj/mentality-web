'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { useAdminCompany } from '@/context/adminCompanyContext'
import { getCompanies } from '@/requests/companies'
import { CustomSession } from '@/types/auth'
import { CompanyEntity } from '@/types/company'

const STORAGE_KEY = 'adminSelectedCompanyId'

export function useCompanySelector() {
  const { data, status } = useSession()
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
      setCompanyId(isValid ? stored : companies[0].id)
    }
  }, [companyId, companies, setCompanyId])

  const handleSetCompanyId = useCallback(
    (id: string | null) => {
      if (id) localStorage.setItem(STORAGE_KEY, id)
      setCompanyId(id)
    },
    [setCompanyId]
  )

  return { companies, companyId, setCompanyId: handleSetCompanyId, loading, error }
}
