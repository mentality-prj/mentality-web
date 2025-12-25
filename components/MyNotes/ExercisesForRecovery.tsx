import { getTranslations } from 'next-intl/server'

import CustomCard from '@/ds/components/CustomCard'
import { SectionCard } from '@/ds/components/SectionCard'
import { HumanEmoji } from '@/ds/icons/emoji/human'
import { LungsEmoji } from '@/ds/icons/emoji/lungs'
import { PinchedFingersEmoji } from '@/ds/icons/emoji/pinched-fingers'

export async function ExercisesForRecovery() {
  const t = await getTranslations()

  const cardExercisesData = [
    { key: 'card1', icon: <HumanEmoji />, link: '' },
    { key: 'card2', icon: <LungsEmoji />, link: '' },
    { key: 'card3', icon: <PinchedFingersEmoji />, link: '' },
  ] as const

  return (
    <SectionCard title={t('common.PageTitle.title', { title: 'exercises' })}>
      <div className="grid grid-cols-1 gap-8 laptop:grid-cols-2 desktop:grid-cols-3">
        {cardExercisesData.map(({ key, icon, link }) => (
          <CustomCard
            key={key}
            icon={icon}
            title={t(`components.ExercisesForRecovery.${key}.title`)}
            text={t(`components.ExercisesForRecovery.${key}.desc`)}
            hrefLink={`my-notes/${link}`}
            textLink={t('common.buttonText.moreDetails')}
          />
        ))}
      </div>
    </SectionCard>
  )
}
