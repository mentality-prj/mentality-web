'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { EditEmployeeModal } from '@/components/features/Company/CompanyAdmin/EmployeeList/EditEmployeeModal'
import { Pagination } from '@/components/shared/Pagination/Pagination'
import { useEmployeeTable } from '@/hooks/useEmployeeTable'
import { useGroups } from '@/hooks/useGroups'
import { EmployeeEntity } from '@/types/company'
import { Button } from '@/ui/button'

export function EmployeeTable() {
  const t = useTranslations('pages.Company.companyAdmin.employees')
  const tRoles = useTranslations('pages.Company.roles')
  const { items, page, setPage, loading, error, totalPages, handleRemove, handleEdit } = useEmployeeTable()
  const { items: groups } = useGroups()
  const [editingEmployee, setEditingEmployee] = useState<EmployeeEntity | null>(null)

  if (loading) return <p className="text-sm text-textcolor-secondary">{t('loading')}</p>
  if (error) return <p className="text-destructive text-sm">{error}</p>
  if (items.length === 0) return <p className="text-sm text-textcolor-secondary">{t('empty')}</p>

  return (
    <div className="flex flex-col gap-xs">
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
                <td className="px-4 py-2">{emp.groupsCount}</td>
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

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {editingEmployee && (
        <EditEmployeeModal
          employeeId={editingEmployee.id}
          employeeName={editingEmployee.name || editingEmployee.email}
          currentRole={editingEmployee.role}
          currentGroupIds={editingEmployee.groupIds}
          groups={groups}
          onSave={handleEdit}
          onClose={() => setEditingEmployee(null)}
        />
      )}
    </div>
  )
}
