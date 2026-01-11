'use client'
import React from 'react'

import Loading from '@/components/Loading'
import useAffirmations from '@/hooks/useAffirmations'

import AffirmationCard from './AffirmationCard'

const DailyAffirmationClient = () => {
  const { items, loading } = useAffirmations(false, 1)

  if (loading) return <Loading size={16} />

  const item = items && items.length > 0 ? items[0] : null

  if (!item) return

  return <AffirmationCard item={item} />
}

export default DailyAffirmationClient
