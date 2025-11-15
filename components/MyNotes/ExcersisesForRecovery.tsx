import { getTranslations } from 'next-intl/server'

import { CustomCard } from '@/ds/components/CustomCard'
import { SectionCard } from '@/ds/components/SectionCard'
import { HumanEmoji } from '@/ds/icons/emoji/human'
import { LungsEmoji } from '@/ds/icons/emoji/lungs'
import { Button } from '@/ds/shadcn/button'

export async function ExcersisesFoeRecovery() {
  const t = await getTranslations('MyNotesPage')

  const cardExercisesData = [
    { key: 'card1', icon: <HumanEmoji />, link: '' },
    { key: 'card2', icon: <LungsEmoji />, link: '' },
    { key: 'card3', icon: '', link: '' },
  ]

  return (
    <SectionCard title={t('ExercisesTitle')}>
      <div className="grid grid-cols-1 gap-8 laptop:grid-cols-2 desktop:grid-cols-3">
        {cardExercisesData.map(({ key, icon }) => (
          <CustomCard
            variant="smallWithChildren"
            key={key}
            icon={icon}
            title={t(`ExercisesCards.${key}.title`)}
            description={t(`ExercisesCards.${key}.desc`)}
          >
            {/* <Link href={`my-notes/${link}`}> */}
            <Button variant="textButton" className="flex justify-self-end">
              {t('ExerciseButton')}
            </Button>
            {/* </Link> */}
          </CustomCard>
        ))}
      </div>
    </SectionCard>
  )
}
