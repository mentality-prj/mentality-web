import { getTranslations } from 'next-intl/server'

import { AnalyticsReportSettings } from '@/components/features/Settings/AnalyticsReportSettings'
import { PageTitle } from '@/ds/components/PageTitle'

export default async function Settings() {
  const t = await getTranslations('pages.Settings')

  return (
    <div className="gap-xl flex flex-col">
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
      <AnalyticsReportSettings />
    </div>
  )
}
