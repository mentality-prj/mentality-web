'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Props {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export default function Pagination({ page, totalPages, onPageChange, className = '' }: Props) {
  const t = useTranslations('common.General')
  return (
    <nav className={`flex items-center justify-between ${className}`} aria-label="Pagination">
      <div>
        <button
          className="rounded bg-gray-100 p-2 disabled:opacity-50"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          aria-label={t('previous')}
          title={t('previous')}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      <div className="text-sm text-gray-600">
        {t('page')} {page} / {totalPages}
      </div>

      <div>
        <button
          className="rounded bg-gray-100 p-2 disabled:opacity-50"
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
