import { getTranslations } from 'next-intl/server'

import { AffirmationHistory } from '@/components/AffirmationsAndTips/AffirmationHistory'
import { DailyCard } from '@/components/ui/DailyCard'
import { PageTitle } from '@/components/ui/PageTitle'
import { Breadcrumbs } from '@/ds/components/Breadcrumbs'
import { mockDailyAffirmation, mockDailyTip } from '@/REST/mockApi'

export default async function AffirmationsPage() {
  const dailyAffirmation = await mockDailyAffirmation()
  const dailyTip = await mockDailyTip()
  const t = await getTranslations('AffirmationsPage')
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        currentPage={t('title')}
        breadcrumbList={[{ title: `${t('ThoughtsList.title')}`, href: '/my-notes' }]}
      />
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
      <div className="grid grid-cols-1 gap-6 laptop:grid-cols-2">
        <DailyCard variant="secondary" type="affirmation" {...dailyAffirmation} />
        <DailyCard variant="secondary" type="tip" {...dailyTip} />
      </div>

      <AffirmationHistory />
    </div>
  )
}
