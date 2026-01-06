'use client'
import React from 'react'
import { Lightbulb } from 'lucide-react'
import { useLocale } from 'next-intl'

import Card from '@/components/Cards/Card'
import Loading from '@/components/Loading'
import Quote from '@/components/Quote'
import useTips from '@/hooks/useTips'
import { SupportedLanguage } from '@/types/languages'

const DailyTipClient = () => {
  const locale = useLocale() as SupportedLanguage
  const { items, loading } = useTips(false, 1)
  const tip = items && items.length > 0 ? items[0] : null

  return (
    <Card tools={<Lightbulb size={16} />}>
      {loading ? (
        <Loading size={16} className="text-gray-500" />
      ) : tip ? (
        <Quote text={`${tip.translations?.[`${locale}`] ?? ''}`} />
      ) : (
        <div>...</div>
      )}
    </Card>
  )
}

export default DailyTipClient
