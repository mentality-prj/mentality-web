'use client'
import React from 'react'

import useAffirmations from '@/hooks/useAffirmations'

import AffirmationCard from './AffirmationCard'

export default function DailyAffirmationClient() {
  const { items, loading } = useAffirmations(false, 1)

  if (loading) return <div className="text-sm text-gray-500">Loading…</div>

  const item = items && items.length > 0 ? items[0] : null

  if (!item) return <div className="text-sm text-gray-500">No affirmation available.</div>

  return <AffirmationCard item={item} />
}
