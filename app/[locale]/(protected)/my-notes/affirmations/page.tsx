import { getTranslations } from 'next-intl/server'

import { AffirmationHistory } from '@/components/AffirmationsAndTips/AffirmationHistory'
import { Breadcrumbs } from '@/ds/components/Breadcrumbs'
import { PageTitle } from '@/ds/components/PageTitle'

export default async function AffirmationsPage() {
  // const dailyAffirmation = await mockDailyAffirmation()
  // const dailyTip = await mockDailyTip()
  const t = await getTranslations('AffirmationsPage')
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        currentPage={t('title')}
        breadcrumbList={[{ title: `${t('ThoughtsList.title')}`, href: '/my-notes' }]}
      />
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
      <div className="grid grid-cols-1 gap-6 laptop:grid-cols-2">
        {/*TODO:replace with CustomCard <DailyCard type="affirmation" {...dailyAffirmation} />
        <DailyCard type="tip" {...dailyTip} /> */}
      </div>

      <AffirmationHistory />
    </div>
  )
}
