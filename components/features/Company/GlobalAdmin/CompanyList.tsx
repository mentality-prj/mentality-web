import { Building2 } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { DashboardItem } from '@/components/admin/DashboardItem'
import { Routes } from '@/constants/routes'
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
          <DashboardItem
            href={Routes.adminCompanyDetail(company.id)}
            icon={<Building2 size={18} />}
            title={company.name}
            subtitle={new Date(company.createdAt).toLocaleDateString()}
            badge={<Badge variant="secondary">{t('companyBadge')}</Badge>}
          />
        </li>
      ))}
    </ul>
  )
}
