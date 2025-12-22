import { getTranslations } from 'next-intl/server'

import CustomCard from '@/ds/components/CustomCard'
import { SectionCard } from '@/ds/components/SectionCard'
import { HumanEmoji } from '@/ds/icons/emoji/human'
import { LungsEmoji } from '@/ds/icons/emoji/lungs'
import { PinchedFingersEmoji } from '@/ds/icons/emoji/pinched-fingers'

export async function ExercisesForRecovery() {
  const t = await getTranslations()

  const cardExercisesData = [
    { key: 'meditation', icon: <HumanEmoji />, link: 'meditation' },
    { key: 'breathing', icon: <LungsEmoji />, link: 'breathing' },
    { key: 'calming', icon: <PinchedFingersEmoji />, link: 'calming' },
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
            hrefLink={`guide?tab=${link}`}
            textLink={t('common.buttonText.moreDetails')}
          />
        ))}
      </div>
    </SectionCard>
  )
}
