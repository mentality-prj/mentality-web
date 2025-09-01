export type Mood = 'very good' | 'good' | 'neutral' | 'bad' | 'very bad'
export type Stress = 'absent' | 'low' | 'average' | 'high' | 'very high'

export type BestDay = {
  mood: Mood
  stress: Stress
  date: string
}
