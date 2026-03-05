'use client'

import { memo } from 'react'

import { RadioQuestion } from '@/components/features/TestsQuestionnarie/typesTestPage'
import { QuestionRadio } from '@/components/shared/QuestionRadio'

interface Phq9QuestionProps {
  data: RadioQuestion
  index: number
  selectedValue: number | undefined
  onChange: (value: number) => void
}

export const Phq9Question = memo(function Phq9Question({ data, index, selectedValue, onChange }: Phq9QuestionProps) {
  return (
    <QuestionRadio
      question={data.text}
      index={index}
      options={data.options}
      selectedValue={selectedValue}
      onChange={onChange}
    />
  )
})
