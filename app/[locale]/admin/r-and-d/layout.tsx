import { getTranslations } from 'next-intl/server'

import { ResearchInnerMenu } from '@/components/features/Admin/Research/ResearchInnerMenu'
import { AdminCompanySelector } from '@/components/features/Company/AdminCompanySelector'
import { AdminCompanyWrapper } from '@/components/features/Company/AdminCompanyWrapper'
import { AdminLayoutProvider } from '@/components/features/Company/AdminLayoutProvider'
import { PageTitle } from '@/ds/components/PageTitle'

export default async function AdminResearchLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('pages.Admin')

  return (
    <AdminLayoutProvider>
      <div className="flex flex-col gap-md">
        <PageTitle title={t('r-and-d.title')} subtitle={t('r-and-d.subtitle')} />
        <AdminCompanySelector />
        <ResearchInnerMenu />
        <AdminCompanyWrapper>{children}</AdminCompanyWrapper>
      </div>
    </AdminLayoutProvider>
  )
}
