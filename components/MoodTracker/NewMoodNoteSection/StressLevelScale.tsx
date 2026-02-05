'use client'

import { useTranslations } from 'next-intl'

import { STRESSES } from '@/constants/stress'
import { Slider } from '@/ds/components/Slider'

export function StressLevelScale({ onChange }: { onChange?: (value: number) => void }) {
  const t = useTranslations('components.StressLevelScale')

  const marks = STRESSES.map(({ value, label }) => ({
    value,
    label: t(label),
  }))

  const habdleChange = (value: number) => {
    console.log('value', value)
    if (onChange) {
      onChange(value)
    }
  }

  return (
    <Slider
      defaultValue={0}
      min={0}
      max={4}
      step={1}
      marks={marks}
      orientation="vertical"
      className="h-40"
      onChange={habdleChange}
    />
  )
}
