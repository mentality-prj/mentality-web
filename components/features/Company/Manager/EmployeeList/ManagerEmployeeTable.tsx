'use client'

import { useTranslations } from 'next-intl'

import { Pagination } from '@/components/shared/Pagination/Pagination'
import { useEmployeeTable } from '@/hooks/useEmployeeTable'

export function ManagerEmployeeTable() {
  const t = useTranslations('pages.Company.companyAdmin.employees')
  const tRoles = useTranslations('pages.Company.roles')
  const { items, page, setPage, loading, error, totalPages } = useEmployeeTable()

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
              <th className="px-4 py-2 text-left font-medium">{t('columns.grade')}</th>
              <th className="px-4 py-2 text-left font-medium">{t('columns.salary')}</th>
              <th className="px-4 py-2 text-left font-medium">{t('columns.groups')}</th>
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
                <td className="px-4 py-2">
                  {emp.gradeName ? (
                    <span className="rounded-full bg-secondary/20 px-2 py-0.5 text-xs font-medium text-textcolor-secondary">
                      {emp.gradeName}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-2 text-sm text-textcolor-secondary">
                  {emp.avgAnnualSalaryEur != null ? `€${emp.avgAnnualSalaryEur.toLocaleString()}` : '—'}
                </td>
                <td className="px-4 py-2">{emp.groupsCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
