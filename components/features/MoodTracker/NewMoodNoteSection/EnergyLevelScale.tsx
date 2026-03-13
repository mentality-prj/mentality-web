'use client'

import { Battery, BatteryFull, BatteryLow, BatteryMedium, BatteryPlus } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { ENERGIES } from '@/constants/energy'
import { Slider } from '@/ds/components/Slider'

export function EnergyLevelScale({ value, onChange }: { value?: number; onChange?: (value: number) => void }) {
  const t = useTranslations('components.EnergyLevelScale')

  const marks = ENERGIES.map(({ value, label }) => ({
    value,
    label: t(label),
  }))

  const fillColor = value !== undefined ? ENERGIES.find((e) => e.value === value)?.color : undefined

  const getBatteryIcon = () => {
    const iconProps = { size: 14, style: { transform: 'rotate(-90deg)' } }

    switch (value) {
      case 1:
        return <Battery {...iconProps} />
      case 2:
        return <BatteryLow {...iconProps} />
      case 3:
        return <BatteryMedium {...iconProps} />
      case 4:
        return <BatteryFull {...iconProps} />
      case 5:
        return <BatteryPlus {...iconProps} />
      default:
        return <Battery {...iconProps} />
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
      defaultValue={1}
      min={1}
      max={5}
      step={1}
      marks={marks}
      orientation="vertical"
      className="h-40"
      onChange={handleChange}
      fillColor={fillColor}
      thumbIcon={getBatteryIcon()}
    />
  )
}
