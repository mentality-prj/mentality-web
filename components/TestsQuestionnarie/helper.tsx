import { TestConfig } from './typesTestPage'

// Тип для відповідей
export type TestAnswers = Record<string, number | boolean>

// Підрахунок для тесту Щербатих
export function calculateScherbatihResult(test: TestConfig<'checkbox'>, answers: TestAnswers): string {
  let totalScore = 0

  for (const question of test.questions) {
    const checked = answers[question.id] as boolean
    if (checked) {
      const weight = test.groupWeights?.[question.group] ?? 1
      totalScore += weight
    }
  }

  const result = test.resultMapping.find(({ min, max }) => totalScore >= min && totalScore <= max)
  return result?.label ?? 'Невизначено'
}

// Підрахунок для тесту K10 (радіо)
export function calculateK10Result(test: TestConfig<'radio'>, answers: TestAnswers): string {
  let totalScore = 0

  for (const question of test.questions) {
    const value = answers[question.id] as number
    totalScore += value
  }

  const result = test.resultMapping.find(({ min, max }) => totalScore >= min && totalScore <= max)
  return result?.label ?? 'Невизначено'
}
