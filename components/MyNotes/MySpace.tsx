import { getTranslations } from 'next-intl/server'

import { CustomCard } from '@/ds/components/CustomCard'
import { SectionCard } from '@/ds/components/SectionCard'
import { ChatRoundLikeIcon } from '@/ds/icons/chat-round-like'
import { NotesMinimalisticIcon } from '@/ds/icons/notes-minimalistic'
import { StarRingIcon } from '@/ds/icons/star-ring'
import { StarsIcon } from '@/ds/icons/stars'

export async function MySpace() {
  const t = await getTranslations()

  const cardMyNotesData = [
    { key: 'card1', link: '/my-thoughts', icon: <ChatRoundLikeIcon /> },
    { key: 'card2', link: '/tests', icon: <NotesMinimalisticIcon /> },
    { key: 'card3', link: '/affirmations', icon: <StarRingIcon /> },
    { key: 'card4', link: '/saved', icon: <StarsIcon /> },
  ] as const

  return (
    <SectionCard title={t('common.SectionCard.title', { title: 'mySpace' })}>
      <div className="grid grid-cols-1 gap-8 laptop:grid-cols-2">
        {cardMyNotesData.map(({ key, link, icon }) => (
          <CustomCard
            key={key}
            title={t(`components.MySpaceCards.${key}.title`)}
            text={t(`components.MySpaceCards.${key}.desc`)}
            hrefLink={`my-notes/${link}`}
            textLink={t('common.buttonText.goTo')}
            backgroundIcon={icon}
          />
        ))}
      </div>
    </SectionCard>
  )
}
