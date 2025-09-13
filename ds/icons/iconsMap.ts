import { SunIcon } from '@/components/icons/navbar/sun-icon'

import { PuzzleEmoji } from './emoji/puzzle'
import { ChartIncreasingIcon } from './chart-increasing'
import { ClappingHandsIcon } from './clapping-hands'
import { DizzyIcon } from './dizzy'
import { FlexedBicepsIcon } from './flexed-biceps'
import { ManInLotusIcon } from './man-in-lotus'
import { MedalCircleIcon } from './medal-circle'
import { SparklesIcon } from './sparkles'
import { WritingHandIcon } from './writing-hand'

export const iconsMap = {
  sun: SunIcon,
  medal: MedalCircleIcon,
  sparkles: SparklesIcon,
  puzzle: PuzzleEmoji,
  pen: WritingHandIcon,
  muscle: FlexedBicepsIcon,
  clap: ClappingHandsIcon,
  dizzy: DizzyIcon,
  chart: ChartIncreasingIcon,
  meditation: ManInLotusIcon,
} as const

export type IconKey = keyof typeof iconsMap
