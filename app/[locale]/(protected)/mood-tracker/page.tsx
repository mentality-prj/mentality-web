import { getTranslations } from 'next-intl/server'

import { NewMoodNoteSection } from '@/components/MoodTracker/NewMoodNoteSection'
import { TenDaysSummary } from '@/components/MoodTracker/TenDaysSummary'
import { PageTitle } from '@/ds/components/PageTitle'

export default async function MoodTracker() {
  const t = await getTranslations('MoodTracker.PageTitle')

  return (
    <div className="flex flex-col gap-8">
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
      <div className="flex w-full flex-col gap-2 tablet:gap-8 desktop:flex-row">
        <div className="desktop:w-3/5">
          <NewMoodNoteSection />
        </div>
        <div className="desktop:w-2/5">
          <TenDaysSummary />
        </div>
      </div>
    </div>
  )
}
