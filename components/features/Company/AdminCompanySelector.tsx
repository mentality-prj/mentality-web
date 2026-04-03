'use client'

import { useTranslations } from 'next-intl'

import { useCompanySelector } from '@/hooks/useCompanySelector'
import { Label } from '@/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

export function AdminCompanySelector() {
  const t = useTranslations('pages.Company.adminSelector')
  const { companies, companyId, setCompanyId, loading } = useCompanySelector()

  if (loading) return <p className="text-sm text-textcolor-secondary">{t('loading')}</p>
  if (companies.length === 0) return <p className="text-sm text-textcolor-secondary">{t('empty')}</p>

  return (
    <div className="flex flex-col gap-1.5 rounded-md border border-primary/20 bg-primary/5 p-4">
      <Label htmlFor="admin-company-select" className="text-sm font-semibold">
        {t('label')}
      </Label>
      <p className="text-xs text-textcolor-secondary">{t('description')}</p>
      <Select value={companyId ?? ''} onValueChange={setCompanyId}>
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
    </div>
  )
}
