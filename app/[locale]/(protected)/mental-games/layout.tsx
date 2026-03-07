import { getTranslations } from 'next-intl/server'

import { MentalGamesInnerMenu } from '@/components/features/MentalGames/MentalGamesInnerMenu'
import { PageTitle } from '@/ds/components/PageTitle'

export default async function MentalGamesLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('pages.MentalGames')

  return (
    <div className="flex flex-col gap-md">
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
      <MentalGamesInnerMenu />
      {children}
    </div>
  )
}
