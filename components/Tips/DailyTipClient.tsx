'use client'
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

  if (loading) return <Loading size={16} />

  const item = items && items.length > 0 ? items[0] : null

  if (!item) return

  return (
    <Card tools={<Lightbulb size={16} />}>
      <Quote text={`${item.translations?.[`${locale}`]}`} />
    </Card>
  )
}

export default DailyTipClient
