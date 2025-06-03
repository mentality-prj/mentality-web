import { EmojiKey } from './emoji'

export type Exercise = {
  title: string
  description: string
  icon: EmojiKey
}

export type ExercisesForRecoveryProps = {
  exercises: Exercise[]
}
