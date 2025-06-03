import { JSX } from 'react'

import { CloudEmoji } from '@/ds/icons/emoji/cloud'
import { HeadphonesEmoji } from '@/ds/icons/emoji/headphones'
import { HeartEmoji } from '@/ds/icons/emoji/heart'
import { HumanEmoji } from '@/ds/icons/emoji/human'
import { LungsEmoji } from '@/ds/icons/emoji/lungs'
import { SOSEmoji } from '@/ds/icons/emoji/sos'
import { EmojiKey } from '@/types/emoji'

export function getEmojiFromBackend(key: EmojiKey): JSX.Element {
  switch (key) {
    case 'lungs':
      return <LungsEmoji />
    case 'headphones':
      return <HeadphonesEmoji />
    case 'human':
      return <HumanEmoji />
    case 'sos':
      return <SOSEmoji />
    case 'cloud':
      return <CloudEmoji />
    case 'heart':
      return <HeartEmoji />
    default:
      return <HeartEmoji />
  }
}
