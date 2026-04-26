'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Pagination } from '@/components/shared/Pagination/Pagination'
import { useAuth } from '@/context/AuthProvider'
import { cn } from '@/lib/utils'
import { adminCancelInvite, adminGetInvites } from '@/requests/companyAdmin'
import { CustomSession } from '@/types/auth'
import { InviteEntity, InviteStatus } from '@/types/company'
import { Button } from '@/ui/button'

const STATUS_CLASSES: Record<InviteStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  cancelled: 'bg-slate-100 text-slate-600',
  expired: 'bg-gray-100 text-gray-500',
}

const PAGE_SIZE = 20

type Props = {
  companyId: string
}

export function AdminInviteList({ companyId }: Props) {
  const t = useTranslations('pages.Company.invites')
  const tRoles = useTranslations('pages.Company.roles')
  const { session: data, status } = useAuth()
  const [items, setItems] = useState<InviteEntity[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInvites = useCallback(async () => {
    setLoading(true)
    setError(null)
    const res = await adminGetInvites(data as CustomSession, companyId, page, PAGE_SIZE)
    if ('error' in res) {
      setError(res.error)
    } else {
      setItems(res.data.items)
      setTotal(res.data.total)
    }
    setLoading(false)
  }, [data, companyId, page])

  useEffect(() => {
    if (status === 'authenticated') fetchInvites()
    else if (status === 'unauthenticated') {
      setItems([])
      setTotal(0)
      setLoading(false)
    }
  }, [fetchInvites, status])

  async function onCancel(id: string) {
    const res = await adminCancelInvite(data as CustomSession, companyId, id)
    if ('error' in res) {
      toast.error(res.error)
      return
    }
    toast.success(t('cancelled'))
    setItems((prev) => prev.filter((inv) => inv.id !== id))
    setTotal((prevTotal) => {
      const nextTotal = Math.max(0, prevTotal - 1)
      const nextTotalPages = Math.max(1, Math.ceil(nextTotal / PAGE_SIZE))
      setPage((prevPage) => Math.min(prevPage, nextTotalPages))
      return nextTotal
    })
  }

  if (loading) return <p className="text-sm text-textcolor-secondary">{t('loading')}</p>
  if (error) return <p className="text-destructive text-sm">{error}</p>
  if (items.length === 0) return <p className="text-sm text-textcolor-secondary">{t('empty')}</p>

  return (
    <div className="flex flex-col gap-xs">
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
                  <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', STATUS_CLASSES[inv.status])}>
                    {t(`status.${inv.status}`)}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1">
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

      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))} onPageChange={setPage} />
    </div>
  )
}
