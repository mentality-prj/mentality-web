'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { useAdminCompany } from '@/context/adminCompanyContext'
import { getCompanies } from '@/requests/companies'
import { CustomSession } from '@/types/auth'
import { CompanyEntity } from '@/types/company'

export function useCompanySelector() {
  const { data, status } = useSession()
  const { companyId, setCompanyId } = useAdminCompany()
  const [companies, setCompanies] = useState<CompanyEntity[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCompanies = useCallback(async () => {
    setLoading(true)
    const session = data as CustomSession
    const res = await getCompanies(session)
    if (!('error' in res)) {
      setCompanies(res.data)
      if (!companyId && res.data.length > 0) {
        setCompanyId(res.data.at(0)!.id)
      }
    }
    setLoading(false)
  }, [data, companyId, setCompanyId])

  useEffect(() => {
    if (status === 'authenticated') fetchCompanies()
  }, [status, fetchCompanies])

  return { companies, companyId, setCompanyId, loading }
}
