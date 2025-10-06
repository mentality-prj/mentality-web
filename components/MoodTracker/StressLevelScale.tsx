'use client'

import { useState } from 'react'
import { Scale } from '../../ds/components/Scale'

export function StressLevelScale() {
  const labelsArray = ['Дуже спокійно', 'Спокійно', 'Нейтрально', 'Трохи напружено', 'Дуже напружено']

  const [value, setValue] = useState<number | null>(null)

  return <Scale labels={labelsArray} value={value} onChange={setValue} />
}
