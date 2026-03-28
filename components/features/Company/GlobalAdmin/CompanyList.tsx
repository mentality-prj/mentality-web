import { Building2, ChevronRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { CompanyEntity } from '@/types/company'
import { Badge } from '@/ui/badge'

type Props = {
  companies: CompanyEntity[]
}

export async function CompanyList({ companies }: Props) {
  const t = await getTranslations('pages.Company.globalAdmin.companyList')

  if (companies.length === 0) {
    return <p className="text-sm text-textcolor-secondary">{t('empty')}</p>
  }

  return (
    <ul className="flex flex-col gap-sm">
      {companies.map((company) => (
        <li key={company.id}>
          <Link
            href={Routes.companyAdminDetail(company.id)}
            className="bg-surface hover:shadow-light flex items-center gap-sm rounded-md border border-border p-3 transition-all hover:bg-info"
          >
            <Building2 size={18} className="shrink-0 text-textcolor-secondary" />
            <div className="flex flex-1 flex-col gap-xs">
              <span className="font-medium">{company.name}</span>
              <span className="text-xs text-textcolor-secondary">
                {new Date(company.createdAt).toLocaleDateString()}
              </span>
            </div>
            <Badge variant="secondary">{t('companyBadge')}</Badge>
            <ChevronRight size={16} className="shrink-0 text-textcolor-secondary" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
