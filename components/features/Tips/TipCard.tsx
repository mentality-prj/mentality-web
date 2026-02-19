'use client'
import { ReactNode, useState } from 'react'
import { Calendar } from 'lucide-react'
import { useLocale } from 'next-intl'

import Card from '@/components/shared/Cards/Card'
import FullScreenCard from '@/components/shared/Cards/FullScreenCard'
import { formatDate } from '@/helpers/data'
import { TipEntity } from '@/types/api-responses'
import type { SupportedLanguage } from '@/types/languages'

interface TipCardProps {
  item: TipEntity
  tools?: ReactNode
  className?: string
}

export default function TipCard({ item, tools, className = '' }: TipCardProps) {
  const locale = useLocale() as SupportedLanguage
  const [open, setOpen] = useState(false)

  const text = item.translations?.[locale as SupportedLanguage] || ''
  const createdAt = formatDate(item.createdAt)

  return (
    <>
      <Card
        className={`h-full border bg-white ${className}`}
        sup={createdAt}
        icon={<Calendar size={12} />}
        text={text}
        tools={tools}
        onClick={() => setOpen(true)}
      />

      {open && (
        <FullScreenCard
          type="small"
          text={text}
          createdAt={createdAt}
          icon={<Calendar size={12} />}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
