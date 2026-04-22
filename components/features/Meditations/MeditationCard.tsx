'use client'

import { ReactNode } from 'react'
import { Calendar } from 'lucide-react'
import { useLocale } from 'next-intl'

import { PlayButton } from '@/components/shared/Buttons/PlayButton'
import Card from '@/components/shared/Cards/Card'
import { Routes } from '@/constants/routes'
import { formatDate } from '@/helpers/data'
import { ExerciseEntity } from '@/types/api-responses'
import { SupportedLanguage } from '@/types/languages'

interface Props {
  item: ExerciseEntity
  tools?: ReactNode
  className?: string
}

export default function MeditationCard({ item, tools, className = '' }: Props) {
  const locale = useLocale() as SupportedLanguage
  const title = item.translations?.title[locale as SupportedLanguage] || ''
  const annotation = item.translations?.annotation[locale as SupportedLanguage] || ''
  const description = item.translations?.description[locale as SupportedLanguage] || ''
  const speakableText = description.trim() || annotation.trim()
  const createdAt = formatDate(item.createdAt)

  const combinedTools = (
    <>
      {speakableText && <PlayButton text={speakableText} language={locale} />}
      {tools}
    </>
  )

  return (
    <Card
      className={`h-full border bg-white ${className}`}
      sup={createdAt}
      icon={<Calendar size={12} />}
      title={title}
      text={annotation}
      tools={combinedTools}
      link={Routes.meditationDetail(item.id)}
    />
  )
}
