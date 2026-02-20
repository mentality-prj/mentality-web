import { TestConfig } from './typesTestPage'

// Type for test answers
export type TestAnswers = Record<string, number | boolean>

// Calculation for the Scherbatih test
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

// Calculation for the K10 test (radio choices)
export function calculateK10Result(test: TestConfig<'radio'>, answers: TestAnswers): string {
  let totalScore = 0

  for (const question of test.questions) {
    const value = answers[question.id] as number
    totalScore += value
  }

  const result = test.resultMapping.find(({ min, max }) => totalScore >= min && totalScore <= max)
  return result?.label ?? 'Невизначено'
}
