'use client'

import { useState } from 'react'

import { DaysFilter } from './DaysFilter'

export const DaysFilterWrapper = () => {
  const [filter, setFilter] = useState<'with' | 'without'>('with')

  const handleChange = (value: 'with' | 'without') => {
    setFilter(value)
    // function of filtration
  }

  return (
    <div className="space-y-4">
      <DaysFilter value={filter} onChange={handleChange} />
    </div>
  )
}
