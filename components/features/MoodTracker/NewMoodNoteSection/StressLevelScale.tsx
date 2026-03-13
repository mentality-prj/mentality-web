'use client'

import { Cloud, CloudLightning, CloudRain, Sun, Wind } from 'lucide-react'
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

  const getStressIcon = () => {
    const iconProps = { size: 14 }

    switch (value) {
      case 0:
        return <Sun {...iconProps} />
      case 1:
        return <Wind {...iconProps} />
      case 2:
        return <Cloud {...iconProps} />
      case 3:
        return <CloudRain {...iconProps} />
      case 4:
        return <CloudLightning {...iconProps} />
      default:
        return <Sun {...iconProps} />
    }
  }

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
      thumbIcon={getStressIcon()}
    />
  )
}
