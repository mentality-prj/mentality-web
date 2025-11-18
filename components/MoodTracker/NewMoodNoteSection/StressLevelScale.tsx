'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { Scale } from '@/ds/components/Scale'

export function StressLevelScale() {
  const t = useTranslations('MoodTracker.StressLevelScale.labelsArray')

  const labelsArray = [t('none'), t('low'), t('medium'), t('high'), t('very high')]

  const [value, setValue] = useState<number | null>(null)

  return <Scale labels={labelsArray} value={value} onChange={setValue} />
}
