'use client'

import { useTranslations } from 'next-intl'

import { HighlightCard } from '@/components/shared/Cards/HighlightCard'
import { useCompanySelector } from '@/hooks/useCompanySelector'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

export function AdminCompanySelector() {
  const t = useTranslations('pages.Company.adminSelector')
  const { companies, companyId, setCompanyId, loading, error } = useCompanySelector()

  if (loading) return <p className="text-sm text-textcolor-secondary">{t('loading')}</p>
  if (error) return <p className="text-sm text-textcolor-secondary">{error}</p>
  if (companies.length === 0) return <p className="text-sm text-textcolor-secondary">{t('empty')}</p>

  return (
    <HighlightCard label={t('label')} description={t('description')} labelHtmlFor="admin-company-select">
      <Select value={companyId ?? undefined} onValueChange={(value) => setCompanyId(value === '' ? null : value)}>
        <SelectTrigger id="admin-company-select" className="max-w-sm">
          <SelectValue placeholder={t('placeholder')} />
        </SelectTrigger>
        <SelectContent>
          {companies.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </HighlightCard>
  )
}
