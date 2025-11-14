import { getTranslations } from 'next-intl/server'

import { PageTitle } from '@/components/ui/PageTitle'
import { Breadcrumbs } from '@/ds/components/Breadcrumbs'
import { CustomCard } from '@/ds/components/CustomCard'
import { CustomLink } from '@/ds/components/CustomLink'
import { SectionCard } from '@/ds/components/SectionCard'

export default async function MeditationPage() {
  const t = await getTranslations('')

  const cardExercisesData = [
    { key: 'замоканий', icon: '', link: '' },
    { key: 'масив', icon: '', link: '' },
    { key: 'карток', icon: '', link: '' },
  ]
  return (
    <>
      <Breadcrumbs
        currentPage="тайтл картки"
        breadcrumbList={[
          { title: `${t('Guide.PageTitle.title')}`, href: '/guide' },
          { title: 'Додати t та лінк', href: '/meditation/${exercise.id}' },
        ]}
      />

      <PageTitle className="pb-8" title={'пропс тайтл картки'} />
      <div className="flex flex-col gap-8">
        <div className="flex h-full w-full flex-row gap-8">
          <SectionCard className="flex-[2_1_0] overflow-hidden">Огляда техніки (з бека)</SectionCard>
          <SectionCard className="flex-[1_1_0] overflow-hidden">поради (з бека)</SectionCard>
        </div>
        <SectionCard title={'Інші дихальні вправи, додати t'}>
          <div className="grid grid-cols-1 gap-6 laptop:grid-cols-2 desktop:grid-cols-3">
            {cardExercisesData.map((card) => (
              <CustomCard
                variant="smallWithChildren"
                key={card.key}
                icon={card.icon}
                title={card.key}
                description={card.key}
              >
                <CustomLink key={card.key} href={`/meditation/${card.key}`} className="flex justify-self-end">
                  Go to {card.key}
                </CustomLink>
              </CustomCard>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  )
}
