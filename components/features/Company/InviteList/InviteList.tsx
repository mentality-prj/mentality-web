'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { RefreshCw, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Pagination } from '@/components/shared/Pagination/Pagination'
import { COMPANY_PAGE_SIZE, INVITE_STATUS_CLASSES } from '@/constants/company'
import { useAdminCompany } from '@/context/adminCompanyContext'
import { useInvites } from '@/hooks/useInvites'
import { cn } from '@/lib/utils'
import { Button } from '@/ui/button'

export function InviteList() {
  const t = useTranslations('pages.Company.invites')
  const tRoles = useTranslations('pages.Company.roles')
  const { companyId: adminCompanyId } = useAdminCompany()
  const [page, setPage] = useState(1)
  const { items, total, loading, error, handleResend, handleCancel } = useInvites(page)

  useEffect(() => {
    setPage(1)
  }, [adminCompanyId])

  async function onResend(id: string) {
    const res = await handleResend(id)
    if (res && 'error' in res) toast.error(res.error || '')
    else toast.success(t('resent'))
  }

  async function onCancel(id: string) {
    const res = await handleCancel(id)
    if (res && 'error' in res) toast.error(res.error || '')
    else toast.success(t('cancelled'))
  }

  if (loading) return <p className="text-sm text-textcolor-secondary">{t('loading')}</p>
  if (error) return <p className="text-destructive text-sm">{error}</p>
  if (items.length === 0) return <p className="text-sm text-textcolor-secondary">{t('empty')}</p>

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-textcolor-secondary">
            <tr>
              <th className="px-4 py-2 text-left font-medium">{t('columns.email')}</th>
              <th className="px-4 py-2 text-left font-medium">{t('columns.role')}</th>
              <th className="px-4 py-2 text-left font-medium">{t('columns.groups')}</th>
              <th className="px-4 py-2 text-left font-medium">{t('columns.status')}</th>
              <th className="px-4 py-2 text-left font-medium">{t('columns.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((inv) => (
              <tr key={inv.id} className="hover:bg-muted/40 border-t border-border">
                <td className="px-4 py-2">{inv.email}</td>
                <td className="px-4 py-2">{tRoles(inv.role)}</td>
                <td className="px-4 py-2">{inv.groupIds.length}</td>
                <td className="px-4 py-2">
                  <span
                    className={cn('rounded-full px-2 py-0.5 text-xs font-medium', INVITE_STATUS_CLASSES[inv.status])}
                  >
                    {t(`status.${inv.status}`)}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1">
                    {(inv.status === 'pending' || inv.status === 'expired') && (
                      <Button
                        size="small"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        aria-label={t('ariaResend')}
                        onClick={() => onResend(inv.id)}
                      >
                        <RefreshCw size={13} />
                      </Button>
                    )}
                    {inv.status === 'pending' && (
                      <Button
                        size="small"
                        variant="ghost"
                        className="text-destructive hover:text-destructive h-7 w-7 p-0"
                        aria-label={t('ariaCancel')}
                        onClick={() => onCancel(inv.id)}
                      >
                        <X size={13} />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / COMPANY_PAGE_SIZE))} onPageChange={setPage} />
    </div>
  )
}
