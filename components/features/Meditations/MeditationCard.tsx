import { ReactNode } from 'react'
import { Calendar } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import Card from '@/components/shared/Cards/Card'
import { formatDate } from '@/helpers/data'
import { Link } from '@/i18n/navigation'
import { ExerciseEntity } from '@/types/api-responses'
import { SupportedLanguage } from '@/types/languages'

interface Props {
  item: ExerciseEntity
  tools?: ReactNode
  className?: string
}

export default function MeditationCard({ item, tools, className = '' }: Props) {
  const locale = useLocale() as SupportedLanguage
  const t = useTranslations('pages.Meditation')
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
    >
      <Link className="underline" href={`/guide/meditations/${item.id}`}>
        {t('linkText')}
      </Link>
    </Card>
  )
}
