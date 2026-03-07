import { getTranslations } from 'next-intl/server'

import { AttentionSprint } from '@/components/features/AttentionSprint'
import { MentalGamesInnerMenu } from '@/components/features/MentalGames/MentalGamesInnerMenu'
import { PageTitle } from '@/ds/components/PageTitle'

export default async function SprintPage() {
  const t = await getTranslations('pages.MentalGames')

  return (
    <article className="flex flex-col gap-md">
      <PageTitle title={t('attentionSprint.title')} subtitle={t('subtitle')} />
      <MentalGamesInnerMenu />
      <div className="p-4">
        <AttentionSprint />
      </div>
    </article>
  )
}
