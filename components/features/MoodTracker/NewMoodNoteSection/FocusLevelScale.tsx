'use client'

import { Focus, Fullscreen, Scan, ScanEye, ScanSearch } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { FOCUSES } from '@/constants/focus'
import { Slider } from '@/ds/components/Slider'

export function FocusLevelScale({ value, onChange }: { value?: number; onChange?: (value: number) => void }) {
  const t = useTranslations('components.FocusLevelScale')

  const marks = FOCUSES.map(({ value, label }) => ({
    value,
    label: t(label),
  }))

  const fillColor = value !== undefined ? FOCUSES.find((f) => f.value === value)?.color : undefined

  const getFocusIcon = () => {
    const iconProps = { size: 14 }

    switch (value) {
      case 0:
        return <Scan {...iconProps} />
      case 1:
        return <ScanSearch {...iconProps} />
      case 2:
        return <Focus {...iconProps} />
      case 3:
        return <Fullscreen {...iconProps} />
      case 4:
        return <ScanEye {...iconProps} />
      default:
        return <Scan {...iconProps} />
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
      thumbIcon={getFocusIcon()}
    />
  )
}
