'use client'

import { useTranslations } from 'next-intl'

import { STRESSES } from '@/constants/stress'
import { Slider } from '@/ds/components/Slider'

export function StressLevelScale({ value, onChange }: { value?: number; onChange?: (value: number) => void }) {
  const t = useTranslations('components.StressLevelScale')

  const marks = STRESSES.map(({ value, label }) => ({
    value,
    label: t(label),
  }))

  const fillColor = value !== undefined ? STRESSES.find((s) => s.value === value)?.color : undefined

  const handleChange = (value: number) => {
    if (onChange) {
      onChange(value)
    }
  }

  return (
    <Slider
      value={value}
      defaultValue={0}
      min={0}
      max={4}
      step={1}
      marks={marks}
      orientation="vertical"
      className="h-40"
      onChange={handleChange}
      fillColor={fillColor}
    />
  )
}
