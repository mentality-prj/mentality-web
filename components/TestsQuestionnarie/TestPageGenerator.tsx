'use client'

import { Button } from '@/ds/shadcn/button'

import Question from './Question'
import { TestConfig } from './typesTestPage'

type Props<T extends 'checkbox' | 'radio'> = {
  test: TestConfig<T>
}

export default function TestPageGenerator<T extends 'checkbox' | 'radio'>({ test }: Props<T>) {
  const testData = test

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">{testData.title}</h1>

      {testData.questions.map((q, idx) => (
        <Question key={q.id} data={q} index={idx} type={testData.type} />
      ))}

      <div className="mt-6">
        <Button>Дізнатися результат</Button>
      </div>
    </div>
  )
}
