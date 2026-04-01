import { Building2 } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { CompanyDetailInnerMenu } from '@/components/features/Company/GlobalAdmin/CompanyDetailInnerMenu/CompanyDetailInnerMenu'
import { getCompanyById } from '@/requests/companies'
import { CustomSession } from '@/types/auth'

export default async function AdminCompanyDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const t = await getTranslations('pages.Company.globalAdmin.companyDetail')
  const session = await auth()
  const result = await getCompanyById(session as CustomSession, id)
  const company = 'error' in result ? null : result.data

  return (
    <div className="flex flex-col gap-xs">
      <div className="flex flex-col gap-xs">
        <div className="flex items-center gap-2">
          <Building2 size={24} className="text-textcolor-secondary" />
          <h1>{company?.name ?? id}</h1>
        </div>
        <p className="mb-2 text-sm text-textcolor-secondary">
          {t('idLabel')}: <span className="font-mono">{id}</span>
        </p>
      </div>
      <CompanyDetailInnerMenu companyId={id} />
      {children}
    </div>
  )
}
