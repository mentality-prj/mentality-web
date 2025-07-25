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
  const testData = test
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
        resultText = 'Немає функції-обробника для цього тесту'
    }
    setResult(resultText)
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">{testData.title}</h1>

      {testData.questions.map((q, idx) => (
        <Question
          key={q.id}
          data={q}
          index={idx}
          type={testData.type}
          selectedValue={answers[q.id] as number}
          onChange={(value) => handleAnswer(q.id, value)}
        />
      ))}

      <div className="mt-6">
        <Button variant="iconButton" size="iconSm" onClick={calculateResult}>
          Дg
        </Button>
        {result && <p>{result}</p>}
      </div>
    </div>
  )
}
