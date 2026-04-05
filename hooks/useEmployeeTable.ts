'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { COMPANY_PAGE_SIZE } from '@/constants/company'
import { useAdminCompany } from '@/context/adminCompanyContext'
import { getEmployees, getEmployeesAdmin, removeEmployee, removeEmployeeAdmin } from '@/requests/employees'
import { CustomSession } from '@/types/auth'
import { EmployeeEntity } from '@/types/company'

export function useEmployeeTable() {
  const t = useTranslations('pages.Company.companyAdmin.employees')
  const { data, status } = useSession()
  const { companyId: adminCompanyId } = useAdminCompany()
  const [items, setItems] = useState<EmployeeEntity[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    setError(null)
    const session = data as CustomSession
    const res = adminCompanyId
      ? await getEmployeesAdmin(session, adminCompanyId, page, COMPANY_PAGE_SIZE)
      : await getEmployees(session, page, COMPANY_PAGE_SIZE)
    if ('error' in res) {
      setError(res.error)
    } else {
      setItems(res.data.items)
      setTotal(res.data.total)
    }
    setLoading(false)
  }, [data, page, adminCompanyId])

  useEffect(() => {
    setPage(1)
    setItems([])
    setTotal(0)
  }, [adminCompanyId])

  useEffect(() => {
    if (status === 'unauthenticated') {
      setItems([])
      setTotal(0)
      setPage(1)
      setError(null)
      setLoading(false)
      return
    }
    if (status === 'authenticated') fetchEmployees()
  }, [fetchEmployees, status])

  async function handleRemove(id: string) {
    if (!confirm(t('removeConfirm'))) return
    const session = data as CustomSession
    const res = adminCompanyId
      ? await removeEmployeeAdmin(session, adminCompanyId, id)
      : await removeEmployee(session, id)
    if ('error' in res) {
      toast.error(res.error)
      return
    }
    toast.success(t('removed'))
    setItems((prev) => prev.filter((e) => e.id !== id))
    setTotal((prev) => Math.max(0, prev - 1))
  }

  const totalPages = Math.max(1, Math.ceil(total / COMPANY_PAGE_SIZE))

  return { items, total, page, setPage, loading, error, totalPages, handleRemove }
}
