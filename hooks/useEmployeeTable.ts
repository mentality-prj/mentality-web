'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthProvider'
import { useTranslations } from 'next-intl'

import { COMPANY_PAGE_SIZE } from '@/constants/company'
import { useAdminCompany } from '@/context/adminCompanyContext'
import { getMyCompany } from '@/requests/companies'
import {
  getEmployees,
  getEmployeesAdmin,
  removeEmployee,
  removeEmployeeAdmin,
  updateEmployee,
  updateEmployeeAdmin,
} from '@/requests/employees'
import { CustomSession } from '@/types/auth'
import { EmployeeEntity, UpdateEmployeeDto } from '@/types/company'

export function useEmployeeTable() {
  const t = useTranslations('pages.Company.companyAdmin.employees')
  const { session: data, status } = useAuth()
  const { companyId: adminCompanyId } = useAdminCompany()
  const myCompanyIdRef = useRef<string | null>(null)
  const [items, setItems] = useState<EmployeeEntity[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    setError(null)
    const session = data as CustomSession
    let res: { data: { items: EmployeeEntity[]; total: number } } | { error: string }
    if (adminCompanyId) {
      res = await getEmployeesAdmin(session, adminCompanyId, page, COMPANY_PAGE_SIZE)
    } else {
      if (!myCompanyIdRef.current) {
        const myCompanyRes = await getMyCompany(session)
        if ('error' in myCompanyRes) {
          setError(myCompanyRes.error)
          setLoading(false)
          return
        }
        myCompanyIdRef.current = myCompanyRes.data.id
      }
      res = await getEmployees(session, myCompanyIdRef.current, page, COMPANY_PAGE_SIZE)
    }
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
      : await removeEmployee(session, myCompanyIdRef.current!, id)
    if ('error' in res) {
      toast.error(res.error)
      return
    }
    toast.success(t('removed'))
    setItems((prev) => prev.filter((e) => e.id !== id))
    setTotal((prev) => Math.max(0, prev - 1))
  }

  async function handleEdit(id: string, dto: UpdateEmployeeDto) {
    const session = data as CustomSession
    const res = adminCompanyId
      ? await updateEmployeeAdmin(session, adminCompanyId, id, dto)
      : await updateEmployee(session, myCompanyIdRef.current!, id, dto)
    if ('error' in res) {
      toast.error(res.error)
      return false
    }
    toast.success(t('updated'))
    setItems((prev) => prev.map((e) => (e.id === id ? res.data : e)))
    return true
  }

  const totalPages = Math.max(1, Math.ceil(total / COMPANY_PAGE_SIZE))

  return { items, total, page, setPage, loading, error, totalPages, handleRemove, handleEdit }
}
