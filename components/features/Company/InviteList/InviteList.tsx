'use client'

import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { RefreshCw, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Pagination } from '@/components/shared/Pagination/Pagination'
import { COMPANY_PAGE_SIZE, INVITE_STATUS_CLASSES } from '@/constants/company'
import { useInvites } from '@/hooks/useInvites'
import { cn } from '@/lib/utils'
import { SortOrder, SORT_ORDER } from '@/types/sort'
import { Button } from '@/ui/button'

type Props = {
  groupFilter?: string[]
  dateFrom?: string
  dateTo?: string
  order?: SortOrder
}

export function InviteList({ groupFilter, dateFrom, dateTo, order }: Props = {}) {
  const t = useTranslations('pages.Company.invites')
  const tRoles = useTranslations('pages.Company.roles')
  const { items, total, page, setPage, loading, error, handleResend, handleCancel } = useInvites()

  const filteredItems = useMemo(() => {
    let result = items

    if (groupFilter?.length) {
      result = result.filter((inv) => inv.groupIds.some((g) => groupFilter.includes(g)))
    }
    if (dateFrom) {
      const from = new Date(dateFrom).getTime()
      result = result.filter((inv) => new Date(inv.createdAt).getTime() >= from)
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime() + 86_400_000 // inclusive
      result = result.filter((inv) => new Date(inv.createdAt).getTime() <= to)
    }

    return order === SORT_ORDER.OLDEST
      ? [...result].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      : [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [items, groupFilter, dateFrom, dateTo, order])

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
  if (filteredItems.length === 0) return <p className="text-sm text-textcolor-secondary">{t('empty')}</p>

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
            {filteredItems.map((inv) => (
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
