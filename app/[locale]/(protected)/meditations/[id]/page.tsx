import { getTranslations } from 'next-intl/server'

import { getMeditations } from '@/actions/meditations.actions'
import { Breadcrumbs } from '@/ds/components/Breadcrumbs'
import { CustomCard } from '@/ds/components/CustomCard'
import { PageTitle } from '@/ds/components/PageTitle'
import { SectionCard } from '@/ds/components/SectionCard'

export default async function MeditationPage({ params }: { params: { id: string } }) {
  const t = await getTranslations('Guide')
  const meditationsData = await getMeditations()
  console.log('cardExercisesData', meditationsData)

  const meditationCard = meditationsData.find((m) => String(m.id) === params.id)
  //add condition of "not founding"
  if (!meditationCard) return <div>Not found</div>

  const otherMeditations = meditationsData
    .filter((m) => m.id !== meditationCard.id && m.category === meditationCard?.category)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)

  return (
    <>
      <Breadcrumbs
        currentPage={meditationCard.title}
        breadcrumbList={[
          { title: `${t('PageTitle.title')}`, href: '/guide' },
          { title: `${t(`Tabs.${meditationCard.category}`)}`, href: '/meditation/${meditation.id}' },
        ]}
      />

      <PageTitle className="py-8" title={meditationCard.title} />
      <div className="flex flex-col gap-8">
        <div className="flex h-full w-full flex-row gap-8">
          <SectionCard title={t('TechniqueOverview')} className="flex-[2_1_0] overflow-hidden">
            <div dangerouslySetInnerHTML={{ __html: meditationCard.description }} />
          </SectionCard>
          <SectionCard className="flex-[1_1_0] overflow-hidden">from backend 2</SectionCard>
        </div>
        <SectionCard title={t(`CardCategory.${meditationCard.category}`)}>
          <div className="grid grid-cols-1 gap-6 laptop:grid-cols-2 desktop:grid-cols-3">
            {otherMeditations.map((meditation) => (
              <CustomCard
                key={meditation.id}
                title={meditation.title}
                text={meditation.annotation}
                hrefLink={`/meditations/${meditation.id}`}
                textLink={t('textLink')}
              />
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  )
}
