import { getTranslations } from 'next-intl/server'

import { PageTitle } from '@/components/ui/PageTitle'
import { SectionCard } from '@/components/ui/SectionCard'
import { CustomCard } from '@/ds/components/CustomCard'
import { Button } from '@/ds/shadcn/button'
import { Link } from '@/i18n/navigation'
import { mockCardRecommendation } from '@/REST/mockApi'

export default async function MyNotes() {
  const cardMyNotesData = [
    { key: 'card1', link: '/my-thoughts' },
    { key: 'card2', link: '/tests' },
    { key: 'card3', link: '/affirmations' },
    { key: 'card4', link: '/saved' },
  ]
  const cardRecommendationData = await mockCardRecommendation()
  const t = await getTranslations('MyNotesPage')
  return (
    <div className="flex flex-col gap-8">
      <PageTitle title={t('title')} subtitle={t('subtitle')} />

      <SectionCard title={t('MySpaceTitle')}>
        <div className="grid grid-cols-1 gap-6 laptop:grid-cols-2">
          {cardMyNotesData.map(({ key, link }) => (
            <CustomCard
              variant="smallWithChildren"
              key={key}
              title={t(`MySpaceCards.${key}.title`)}
              description={t(`MySpaceCards.${key}.desc`)}
            >
              <Link href={`my-notes/${link}`}>
                <Button variant="textButton" className="flex justify-self-end">
                  {t('MySpaceButton')}
                </Button>
              </Link>
            </CustomCard>
          ))}
        </div>
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
