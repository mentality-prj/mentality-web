import { JSX } from 'react'

import { Cloud } from '@/ds/icons/blueIcons/cloud'
import { Diagram } from '@/ds/icons/blueIcons/diagram'
import { PancilPage } from '@/ds/icons/blueIcons/pancil-page'
import { Sun } from '@/ds/icons/blueIcons/sun'

export type EmojiKey = 'pancil-page' | 'diagram' | 'sun' | 'cloud'

export const emojiKeys: EmojiKey[] = ['pancil-page', 'diagram', 'sun', 'cloud']

export function getIconsForMoodTracker(key: EmojiKey): JSX.Element {
  switch (key) {
    case 'pancil-page':
      return <PancilPage />
    case 'diagram':
      return <Diagram />
    case 'sun':
      return <Sun />
    case 'cloud':
      return <Cloud />
  }
}
