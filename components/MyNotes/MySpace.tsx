import { getTranslations } from 'next-intl/server'

import { CustomCard } from '@/ds/components/CustomCard'
import { SectionCard } from '@/ds/components/SectionCard'
import { ChatRoundLikeIcon } from '@/ds/icons/chat-round-like'
import { NotesMinimalisticIcon } from '@/ds/icons/notes-minimalistic'
import { StarRingIcon } from '@/ds/icons/star-ring'
import { StarsIcon } from '@/ds/icons/stars'

export async function MySpace() {
  const t = await getTranslations('MyNotesPage')

  const cardMyNotesData = [
    { key: 'card1', link: '/my-thoughts', icon: <ChatRoundLikeIcon /> },
    { key: 'card2', link: '/tests', icon: <NotesMinimalisticIcon /> },
    { key: 'card3', link: '/affirmations', icon: <StarRingIcon /> },
    { key: 'card4', link: '/saved', icon: <StarsIcon /> },
  ]

  return (
    <SectionCard title={t('MySpaceTitle')}>
      <div className="grid grid-cols-1 gap-8 laptop:grid-cols-2">
        {cardMyNotesData.map(({ key, link, icon }) => (
          <CustomCard
            key={key}
            title={t(`MySpaceCards.${key}.title`)}
            text={t(`MySpaceCards.${key}.desc`)}
            hrefLink={`my-notes/${link}`}
            textLink={t('MySpaceButton')}
            backgroundIcon={icon}
          />
        ))}
      </div>
    </SectionCard>
  )
}
