import { ReactNode } from 'react'
import { Calendar } from 'lucide-react'
import { useLocale } from 'next-intl'

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
  const createdAt = formatDate(item.createdAt)

  return (
    <Card
      className={`h-full border bg-white ${className}`}
      sup={createdAt}
      icon={<Calendar size={12} />}
      title={title}
      text={annotation}
      tools={tools}
      link={Routes.meditationDetail(item.id)}
    />
  )
}
