import { getTranslations } from 'next-intl/server'

import { Breadcrumbs } from '@/ds/components/Breadcrumbs'
import { CustomCard } from '@/ds/components/CustomCard'
import { PageTitle } from '@/ds/components/PageTitle'
import { SectionCard } from '@/ds/components/SectionCard'
import { HumanEmoji } from '@/ds/icons/emoji/human'
import { ManInLotusIcon } from '@/ds/icons/man-in-lotus'

export default async function MeditationPage() {
  const t = await getTranslations('')

  const cardExercisesData = [
    { key: 'API shoud be added', icon: <ManInLotusIcon />, link: '/#' },
    { key: 'shoud be', icon: <HumanEmoji />, link: '/#' },
    { key: 'added', icon: <ManInLotusIcon />, link: '/#' },
  ]
  return (
    <>
      <Breadcrumbs
        currentPage="title of card"
        breadcrumbList={[
          { title: `${t('Guide.PageTitle.title')}`, href: '/guide' },
          { title: 'add t & links', href: '/meditation/${exercise.id}' },
        ]}
      />

      <PageTitle className="pb-8" title={'props card.title'} />
      <div className="flex flex-col gap-8">
        <div className="flex h-full w-full flex-row gap-8">
          <SectionCard className="flex-[2_1_0] overflow-hidden">from backend 1</SectionCard>
          <SectionCard className="flex-[1_1_0] overflow-hidden">from backend 2</SectionCard>
        </div>
        <SectionCard title={'add t'}>
          <div className="grid grid-cols-1 gap-6 laptop:grid-cols-2 desktop:grid-cols-3">
            {cardExercisesData.map((card) => (
              <CustomCard
                key={card.key}
                icon={card.icon}
                title={card.key}
                text={card.key}
                hrefLink={card.link}
                textLink={` Go to ${card.key}`}
              />
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  )
}
