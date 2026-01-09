import { getTranslations } from 'next-intl/server'

import { SectionCard } from '@/ds/components/SectionCard'
import { Link } from '@/i18n/navigation'

import Card from '../Cards/Card'

export async function MySpace() {
  const t = await getTranslations()

  const cardMyNotesData = [
    { key: 'card1', link: '/my-thoughts' },
    { key: 'card2', link: '/tests' },
    { key: 'card3', link: '/affirmations' },
    { key: 'card4', link: '/saved' },
  ] as const

  return (
    <SectionCard title={t('common.SectionCard.title', { title: 'mySpace' })}>
      <div className="grid grid-cols-1 gap-8 laptop:grid-cols-2">
        {cardMyNotesData.map(({ key, link }) => (
          <Card
            key={key}
            title={t(`components.MySpaceCards.${key}.title`)}
            text={t(`components.MySpaceCards.${key}.desc`)}
            aftertext={
              <Link className="text-blue-600 underline" href={`/my-notes/${link}`}>
                {t('common.Buttons.goTo')}
              </Link>
            }
          />
        ))}
      </div>
    </SectionCard>
  )
}
