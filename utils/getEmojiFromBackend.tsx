import { JSX } from 'react'

import { CloudEmoji } from '@/ds/icons/emoji/cloud'
import { HandThatWritesEmoji } from '@/ds/icons/emoji/hand-that-writes'
import { HeadphonesEmoji } from '@/ds/icons/emoji/headphones'
import { HeartEmoji } from '@/ds/icons/emoji/heart'
import { HumanEmoji } from '@/ds/icons/emoji/human'
import { LungsEmoji } from '@/ds/icons/emoji/lungs'
import { PuzzleEmoji } from '@/ds/icons/emoji/puzzle'
import { SOSEmoji } from '@/ds/icons/emoji/sos'
import { StarEmoji } from '@/ds/icons/emoji/star'
import { StarMotionEmoji } from '@/ds/icons/emoji/star-motion'
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
    case 'hand-that-writes':
      return <HandThatWritesEmoji />
    case 'puzzle':
      return <PuzzleEmoji />
    case 'star':
      return <StarEmoji />
    case 'star-motion':
      return <StarMotionEmoji />
    default:
      return <HeartEmoji />
  }
}
