import { getTranslations } from 'next-intl/server'

import { SectionCard } from '@/ds/components/SectionCard'
import { Link } from '@/i18n/navigation'

import Card from '../Cards/Card'

export async function ExercisesForRecovery() {
  const t = await getTranslations('components.ExercisesForRecovery')
  const tButton = await getTranslations('common.Buttons')

  const cardExercisesData = [
    { key: 'meditation', link: 'meditations' },
    { key: 'breathing', link: 'breathing' },
    { key: 'calming', link: 'calming' },
  ] as const

  return (
    <SectionCard title={t('title')}>
      <div className="grid grid-cols-1 gap-8 laptop:grid-cols-2 desktop:grid-cols-3">
        {cardExercisesData.map(({ key, link }) => (
          <Card
            key={key}
            title={t(`${key}.title`)}
            text={t(`${key}.desc`)}
            aftertext={
              <Link className="text-blue-600 underline" href={`/guide/${link}`}>
                {tButton('moreDetails')}
              </Link>
            }
          />
        ))}
      </div>
    </SectionCard>
  )
}
