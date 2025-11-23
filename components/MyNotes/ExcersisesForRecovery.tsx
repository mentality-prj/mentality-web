import { getTranslations } from 'next-intl/server'

import { CustomCard } from '@/ds/components/CustomCard'
import { SectionCard } from '@/ds/components/SectionCard'
import { HumanEmoji } from '@/ds/icons/emoji/human'
import { LungsEmoji } from '@/ds/icons/emoji/lungs'
import { PinchedFingersEmoji } from '@/ds/icons/emoji/pinched-fingers'

export async function ExcersisesFoeRecovery() {
  const t = await getTranslations('MyNotesPage')

  const cardExercisesData = [
    { key: 'card1', icon: <HumanEmoji />, link: '' },
    { key: 'card2', icon: <LungsEmoji />, link: '' },
    { key: 'card3', icon: <PinchedFingersEmoji />, link: '' },
  ]

  return (
    <SectionCard title={t('ExercisesTitle')}>
      <div className="grid grid-cols-1 gap-8 laptop:grid-cols-2 desktop:grid-cols-3">
        {cardExercisesData.map(({ key, icon, link }) => (
          <CustomCard
            key={key}
            icon={icon}
            title={t(`ExercisesCards.${key}.title`)}
            text={t(`ExercisesCards.${key}.desc`)}
            hrefLink={`my-notes/${link}`}
            textLink={t('ExerciseButton')}
          />
        ))}
      </div>
    </SectionCard>
  )
}
