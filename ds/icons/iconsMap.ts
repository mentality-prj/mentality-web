import { ChartIncreasingIcon } from '@/ds/icons/chart-increasing'
import { ClappingHandsIcon } from '@/ds/icons/clapping-hands'
import { DizzyIcon } from '@/ds/icons/dizzy'
import { PuzzleEmoji } from '@/ds/icons/emoji/puzzle'
import { FlexedBicepsIcon } from '@/ds/icons/flexed-biceps'
import { ManInLotusIcon } from '@/ds/icons/man-in-lotus'
import { MedalCircleIcon } from '@/ds/icons/medal-circle'
import { SparklesIcon } from '@/ds/icons/sparkles'
import { SunIcon } from '@/ds/icons/sun-icon'
import { WritingHandIcon } from '@/ds/icons/writing-hand'

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
