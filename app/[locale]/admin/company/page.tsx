import { getTranslations } from 'next-intl/server'

import { CompanyList } from '@/components/features/Company/GlobalAdmin/CompanyList'
import { CreateCompanyForm } from '@/components/features/Company/GlobalAdmin/CreateCompanyForm'
import { PageTitle } from '@/ds/components/PageTitle'
import { getServerSession } from '@/lib/get-server-session'
import { getCompanies } from '@/requests/companies'
import { CustomSession } from '@/types/auth'

export default async function AdminCompanyPage() {
  const session = await getServerSession()
  const t = await getTranslations('pages.Company.globalAdmin')

  const result = await getCompanies(session as CustomSession)
  const companies = 'error' in result ? [] : result.data

  return (
    <div className="flex flex-col gap-lg">
      <PageTitle title={t('title')} />

      <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
        <section className="flex flex-col gap-md">
          <h2 className="text-lg font-semibold">{t('createCompany.title')}</h2>
          <div className="max-w-sm">
            <CreateCompanyForm />
          </div>
        </section>

        <section className="flex flex-col gap-md">
          <h2 className="text-lg font-semibold">{t('companyList.title')}</h2>
          <CompanyList companies={companies} />
        </section>
      </div>
    </div>
  )
}
