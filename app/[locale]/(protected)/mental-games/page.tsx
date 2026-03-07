import { getTranslations } from 'next-intl/server'

import { HoverCard } from '@/components/shared/Cards/HoverCard/HoverCard'
import { mentalGameCardItems } from '@/constants/mentalGames'
import { PageTitle } from '@/ds/components/PageTitle'

export default async function MentalGamesPage() {
  const t = await getTranslations('pages.MentalGames')

  return (
    <div className="flex flex-col gap-md">
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
      <div className="card-container">
        {mentalGameCardItems.map(({ key, href, icon }) => (
          <HoverCard
            key={key}
            href={href}
            icon={icon}
            title={t(`${key}.title` as Parameters<typeof t>[0])}
            description={t(`${key}.description` as Parameters<typeof t>[0])}
            center={true}
          />
        ))}
      </div>
    </div>
  )
}
