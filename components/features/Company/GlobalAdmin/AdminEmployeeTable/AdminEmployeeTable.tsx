'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Pencil, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { Pagination } from '@/components/shared/Pagination/Pagination'
import { adminGetEmployees, adminRemoveEmployee } from '@/requests/companyAdmin'
import { CustomSession } from '@/types/auth'
import { EmployeeEntity } from '@/types/company'
import { Button } from '@/ui/button'

import { ChangeRoleModal } from '../ChangeRoleModal/ChangeRoleModal'

const PAGE_SIZE = 20

type Props = {
  companyId: string
}

export function AdminEmployeeTable({ companyId }: Props) {
  const t = useTranslations('pages.Company.companyAdmin.employees')
  const tRoles = useTranslations('pages.Company.roles')
  const { data, status } = useSession()
  const [items, setItems] = useState<EmployeeEntity[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingEmployee, setEditingEmployee] = useState<EmployeeEntity | null>(null)

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    setError(null)
    const res = await adminGetEmployees(data as CustomSession, companyId, page, PAGE_SIZE)
    if ('error' in res) {
      setError(res.error)
    } else {
      setItems(res.data.items)
      setTotal(res.data.total)
    }
    setLoading(false)
  }, [data, companyId, page])

  useEffect(() => {
    if (status === 'authenticated') fetchEmployees()
    else if (status === 'unauthenticated') {
      setItems([])
      setTotal(0)
      setPage(1)
      setError(null)
      setLoading(false)
    }
  }, [fetchEmployees, status])

  async function handleRemove(id: string) {
    if (!confirm(t('removeConfirm'))) return
    const res = await adminRemoveEmployee(data as CustomSession, companyId, id)
    if ('error' in res) {
      toast.error(res.error)
      return
    }
    toast.success(t('removed'))
    setItems((prev) => prev.filter((e) => e.id !== id))
    setTotal((prevTotal) => {
      const nextTotal = Math.max(0, prevTotal - 1)
      const nextTotalPages = Math.max(1, Math.ceil(nextTotal / PAGE_SIZE))
      setPage((prevPage) => Math.min(prevPage, nextTotalPages))
      return nextTotal
    })
  }

  function handleRoleUpdated(updated: EmployeeEntity) {
    setItems((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
  }

  if (loading) return <p className="text-sm text-textcolor-secondary">{t('loading')}</p>
  if (error) return <p className="text-destructive text-sm">{error}</p>
  if (items.length === 0) return <p className="text-sm text-textcolor-secondary">{t('empty')}</p>

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-textcolor-secondary">
              <tr>
                <th className="px-4 py-2 text-left font-medium">{t('columns.name')}</th>
                <th className="px-4 py-2 text-left font-medium">{t('columns.email')}</th>
                <th className="px-4 py-2 text-left font-medium">{t('columns.role')}</th>
                <th className="px-4 py-2 text-left font-medium">{t('columns.groups')}</th>
                <th className="px-4 py-2 text-left font-medium">{t('columns.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((emp) => (
                <tr key={emp.id} className="hover:bg-muted/40 border-t border-border">
                  <td className="px-4 py-2">{emp.name || '—'}</td>
                  <td className="px-4 py-2">{emp.email}</td>
                  <td className="px-4 py-2">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {tRoles(emp.role)}
                    </span>
                  </td>
                  <td className="px-4 py-2">{emp.groupName ?? emp.groupsCount}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1">
                      <Button
                        size="small"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        aria-label={t('ariaEdit')}
                        onClick={() => setEditingEmployee(emp)}
                      >
                        <Pencil size={13} />
                      </Button>
                      <Button
                        size="small"
                        variant="ghost"
                        className="text-destructive hover:text-destructive h-7 w-7 p-0"
                        aria-label={t('ariaRemove')}
                        onClick={() => handleRemove(emp.id)}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))} onPageChange={setPage} />
      </div>

      {editingEmployee && (
        <ChangeRoleModal
          employee={editingEmployee}
          companyId={companyId}
          onClose={() => setEditingEmployee(null)}
          onSuccess={handleRoleUpdated}
        />
      )}
    </>
  )
}
