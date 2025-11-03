import { getTranslations } from 'next-intl/server'

import { CustomCard } from '@/ds/components/CustomCard'
import { Button } from '@/ds/shadcn/button'
import { Link } from '@/i18n/navigation'

import { SectionCard } from '../ui/SectionCard'

export async function MySpace() {
  const t = await getTranslations('MyNotesPage')

  const cardMyNotesData = [
    { key: 'card1', link: '/my-thoughts' },
    { key: 'card2', link: '/tests' },
    { key: 'card3', link: '/affirmations' },
    { key: 'card4', link: '/saved' },
  ]

  return (
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
  )
}
