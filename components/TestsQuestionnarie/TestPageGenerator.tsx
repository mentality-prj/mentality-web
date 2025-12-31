'use client'

import { useState } from 'react'

import { Button } from '@/ds/shadcn/button'

import { calculateK10Result, calculateScherbatihResult, TestAnswers } from './helper'
import Question from './Question'
import { ChoiceType, TestConfig } from './typesTestPage'

type Props<T extends ChoiceType> = {
  test: TestConfig<T>
}

export default function TestPageGenerator<T extends ChoiceType>({ test }: Props<T>) {
  const [answers, setAnswers] = useState<TestAnswers>({})
  const [result, setResult] = useState<string | null>(null)

  const handleAnswer = (questionId: string, value: number | boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const calculateResult = () => {
    let resultText: string = ''

    switch (test.id) {
      case 'scherbatih':
        resultText = calculateScherbatihResult(test as TestConfig<'checkbox'>, answers)
        break
      case 'k10':
        resultText = calculateK10Result(test as TestConfig<'radio'>, answers)
        break
      default:
        resultText = '! There is no function for this test !'
    }
    setResult(resultText)
  }

  const isTestComplete = () => {
    if (test.type === 'checkbox') {
      return Object.values(answers).some((value) => value === true)
    }

    if (test.type === 'radio') {
      return test.questions.every((q) => answers[q.id] !== undefined)
    }

    return false
  }

  return (
    <div className="px-2 py-2 tablet:mb-4 tablet:p-4 desktop:m-8 desktop:p-8">
      <h1 className="mb-6 text-2xl font-semibold text-textcolor-primary">{test.title}</h1>

      {test.questions.map((q, idx) => (
        <Question
          key={q.id}
          data={q}
          index={idx}
          type={test.type}
          selectedValue={answers[q.id] as number}
          onChange={(value) => handleAnswer(q.id, value)}
        />
      ))}

      <div className="mt-6">
        <Button onClick={calculateResult} disabled={!isTestComplete()}>
          Дізнатися результат
        </Button>
        {result && <div className="background-alt my-4 rounded-md p-4">{result}</div>}
      </div>
    </div>
  )
}
