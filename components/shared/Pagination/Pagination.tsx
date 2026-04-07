'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/ui/button'
import { getPages } from '@/utils/pagination'

interface Props {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ page, totalPages, onPageChange, className = '' }: Props) {
  const t = useTranslations('common.General')
  return (
    <nav className={`flex items-center justify-between ${className}`} aria-label="Pagination">
      <div>
        <button
          className="rounded-sm bg-background px-2 py-3 text-gray-800 transition-shadow hover:bg-background hover:shadow-[0_4px_14px_0_hsl(var(--primary)/0.35)] disabled:opacity-50 disabled:shadow-none"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          aria-label={t('previous')}
          title={t('previous')}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      <div className="flex gap-1 tablet:gap-2">
        {getPages(page, totalPages).map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className="self-end">
              ...
            </span>
          ) : (
            <Button
              key={p}
              onClick={() => onPageChange(p)}
              variant={page === p ? 'secondary' : 'default'}
              disabled={page === p}
              className="rounded-sm bg-background px-3 py-1 text-gray-800 transition-shadow hover:bg-background hover:shadow-[0_4px_14px_0_hsl(var(--primary)/0.35)]"
            >
              {p}
            </Button>
          )
        )}
      </div>

      <div>
        <button
          className="rounded-sm bg-background px-2 py-3 text-gray-800 transition-shadow hover:bg-background hover:shadow-[0_4px_14px_0_hsl(var(--primary)/0.35)] disabled:opacity-50 disabled:shadow-none"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          aria-label={t('next')}
          title={t('next')}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  )
}
