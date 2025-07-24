import { getTranslations } from 'next-intl/server'

import { PageTitle } from '@/components/ui/PageTitle'
import { SectionCard } from '@/components/ui/SectionCard'
import { CustomCard } from '@/ds/components/CustomCard'
import { Link } from '@/i18n/navigation'
import { mockCardMyNotes, mockCardRecommendation } from '@/REST/mockApi'
import { getEmojiFromBackend } from '@/utils/getEmojiFromBackend'

export default async function MyNotes() {
  const cardMyNotesData = await mockCardMyNotes()
  const cardRecommendationData = await mockCardRecommendation()
  const t = await getTranslations('MyNotesPage')
  return (
    <div className="flex flex-col gap-8">
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
      <SectionCard className="grid grid-cols-1 gap-6 laptop:grid-cols-2">
        {cardMyNotesData.map((card, id) => (
          <Link key={id} href={`my-notes/${card.link}`}>
            <CustomCard
              variant="default"
              icon={getEmojiFromBackend(card.icon)}
              title={card.title}
              description={card.description}
            />
          </Link>
        ))}
      </SectionCard>
      <SectionCard title={t('recommendationTitle')}>
        <div className="grid grid-cols-1 gap-6 laptop:grid-cols-2 desktop:grid-cols-3">
          {cardRecommendationData.map((card, id) => (
            <CustomCard
              variant="recommendation"
              key={id}
              tag={card.tag}
              description={card.description}
              title={card.title}
            />
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
