type MeditationDataCategory = 'meditations' | 'breathing' | 'calming'

export type MeditationData = {
  id: string
  category: MeditationDataCategory
  title: string
  annotation: string
  description: string
}
