'use client'
import { ReactNode, useState } from 'react'
import { Calendar } from 'lucide-react'
import { useLocale } from 'next-intl'

import Card from '@/components/Cards/Card'
import FullScreenCard from '@/components/Cards/FullScreenCard'
import TextRenderer from '@/components/Content/TextRenderer'
import { formatDate } from '@/helpers/data'
import { ExerciseEntity } from '@/types/api-responses'
import { SupportedLanguage } from '@/types/languages'

interface Props {
  item: ExerciseEntity
  tools?: ReactNode
  className?: string
}

export default function ExerciseCard({ item, tools, className = '' }: Props) {
  const locale = useLocale() as SupportedLanguage
  const [open, setOpen] = useState(false)

  const title = item.translations?.title[locale as SupportedLanguage] || ''
  const annotation = item.translations?.annotation[locale as SupportedLanguage] || ''
  const description = item.translations?.description[locale as SupportedLanguage] || ''
  const createdAt = formatDate(item.createdAt)

  return (
    <>
      <Card
        className={`h-full cursor-pointer border bg-white ${className}`}
        sup={createdAt}
        icon={<Calendar size={12} />}
        title={title}
        text={annotation}
        tools={tools}
        remark={item.category}
        onClick={() => setOpen(true)}
      />

      {open && (
        <FullScreenCard
          onClose={() => setOpen(false)}
          createdAt={createdAt}
          icon={<Calendar size={12} />}
          title={title}
          text={annotation}
          remark={item.category}
          tags={item.tags}
          className="p-6"
        >
          <TextRenderer text={description} />
        </FullScreenCard>
      )}
    </>
  )
}
