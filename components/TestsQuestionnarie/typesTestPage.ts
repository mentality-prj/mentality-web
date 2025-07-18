export type ChoiceType = 'checkbox' | 'radio'
export type QuestionGroup = 'intellectual' | 'behavioral' | 'emotional' | 'physiological'

export interface Option {
  text: string
  value: number
}

export interface BaseQuestion {
  id: string
  text: string
}

export interface CheckboxQuestionWithGroups extends BaseQuestion {
  group: string
  options?: never
}

export interface RadioQuestion extends BaseQuestion {
  options: Option[]
  group?: never
}

export type QuestionTypes = CheckboxQuestionWithGroups | RadioQuestion

export interface TestConfig<T extends ChoiceType> {
  id: string
  title: string
  type: T
  groupWeights?: T extends 'checkbox' ? Record<QuestionGroup, number> : never
  questions: T extends 'checkbox' ? CheckboxQuestionWithGroups[] : RadioQuestion[]
  scoring: {
    // правила підрахунку балів
    groupWeight?: boolean // чекбокс: true
    perOptionValue?: boolean // радіо: true
  }
  resultMapping: ResultMapping[]
}

export interface ResultMapping {
  min: number
  max: number
  label: string
}
