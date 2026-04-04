'use client'

import { ReactNode, useState } from 'react'
import { Calendar } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { PlayButton } from '@/components/shared/Buttons/PlayButton'
import Card from '@/components/shared/Cards/Card'
import FullScreenCard from '@/components/shared/Cards/FullScreenCard'
import TextRenderer from '@/components/shared/Content/TextRenderer'
import { formatDate } from '@/helpers/data'
import { ExerciseEntity } from '@/types/api-responses'
import { SupportedLanguage } from '@/types/languages'

interface ExerciseCardProps {
  item: ExerciseEntity
  className?: string
  tools?: ReactNode
}

export default function ExerciseCard({ item, className = '', tools }: ExerciseCardProps) {
  const locale = useLocale() as SupportedLanguage
  const [open, setOpen] = useState(false)

  const t = useTranslations('pages.Guide')

  const title = item.translations?.title[locale as SupportedLanguage] || ''
  const annotation = item.translations?.annotation[locale as SupportedLanguage] || ''
  const description = item.translations?.description[locale as SupportedLanguage] || ''
  const category = t('category', { type: item.category })
  const createdAt = formatDate(item.createdAt)

  const combinedtools = (
    <>
      <PlayButton text={description} language={locale} />
      {tools}
    </>
  )

  return (
    <>
      <Card
        className={`h-full cursor-pointer border bg-white ${className}`}
        sup={createdAt}
        icon={<Calendar size={12} />}
        title={title}
        text={annotation}
        tools={combinedtools}
        remark={category}
        onClick={() => setOpen(true)}
      />

      {open && (
        <FullScreenCard
          onClose={() => setOpen(false)}
          createdAt={createdAt}
          icon={<Calendar size={12} />}
          title={title}
          text={annotation}
          remark={category}
          tags={item.tags}
          className="p-6"
        >
          <TextRenderer text={description} />
        </FullScreenCard>
      )}
    </>
  )
}
