'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Pencil, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'

import { Pagination } from '@/components/shared/Pagination/Pagination'
import { extractPaginationTotal } from '@/lib/http'
import { APIUrl } from '@/requests/config'
import { performAuthRequest } from '@/requests/genericFetch'
import { CustomSession } from '@/types/auth'
import { EmployeeEntity } from '@/types/company'
import { COMPANY_ROLES } from '@/types/rbac'
import { Button } from '@/ui/button'

const ROLE_LABELS: Record<string, string> = {
  [COMPANY_ROLES.GLOBAL_ADMIN]: 'Global Admin',
  [COMPANY_ROLES.COMPANY_ADMIN]: 'Admin',
  [COMPANY_ROLES.MANAGER]: 'Manager',
  [COMPANY_ROLES.EMPLOYEE]: 'Employee',
}

const PAGE_SIZE = 20

export function EmployeeTable() {
  const { data } = useSession()
  const [items, setItems] = useState<EmployeeEntity[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    setError(null)
    const session = data as CustomSession
    const url = `${APIUrl}/employees?page=${page}&limit=${PAGE_SIZE}`
    const res = await performAuthRequest<EmployeeEntity[]>(session, url)
    if ('error' in res) {
      setError(res.error)
    } else {
      const list = Array.isArray(res.data) ? res.data : []
      setItems(list)
      setTotal(extractPaginationTotal(res.headers, list.length))
    }
    setLoading(false)
  }, [data, page])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  async function handleRemove(id: string) {
    if (!confirm('Remove this employee from the company?')) return
    const session = data as CustomSession
    const res = await performAuthRequest(session, `${APIUrl}/employees/${id}`, { method: 'DELETE' })
    if ('error' in res) {
      toast.error(res.error)
      return
    }
    toast.success('Employee removed.')
    setItems((prev) => prev.filter((e) => e.id !== id))
    setTotal((t) => t - 1)
  }

  if (loading) return <p className="text-sm text-textcolor-secondary">Loading employees…</p>
  if (error) return <p className="text-destructive text-sm">{error}</p>
  if (items.length === 0) return <p className="text-sm text-textcolor-secondary">No employees found.</p>

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-textcolor-secondary">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Name</th>
              <th className="px-4 py-2 text-left font-medium">Email</th>
              <th className="px-4 py-2 text-left font-medium">Role</th>
              <th className="px-4 py-2 text-left font-medium">Groups</th>
              <th className="px-4 py-2 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((emp) => (
              <tr key={emp.id} className="hover:bg-muted/40 border-t border-border">
                <td className="px-4 py-2">{emp.name || '—'}</td>
                <td className="px-4 py-2">{emp.email}</td>
                <td className="px-4 py-2">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {ROLE_LABELS[emp.role] ?? emp.role}
                  </span>
                </td>
                <td className="px-4 py-2">{emp.groupsCount}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1">
                    <Button size="small" variant="ghost" className="h-7 w-7 p-0" aria-label="Edit employee">
                      <Pencil size={13} />
                    </Button>
                    <Button
                      size="small"
                      variant="ghost"
                      className="text-destructive hover:text-destructive h-7 w-7 p-0"
                      aria-label="Remove employee"
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
  )
}
