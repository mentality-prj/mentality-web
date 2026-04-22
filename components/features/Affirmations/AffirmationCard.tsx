'use client'
import { ReactNode } from 'react'
import { Calendar } from 'lucide-react'
import Image from 'next/image'
import { useLocale } from 'next-intl'

import { PlayButton } from '@/components/shared/Buttons/PlayButton'
import Card from '@/components/shared/Cards/Card'
import { formatDate } from '@/helpers/data'
import { AffirmationEntity } from '@/types/api-responses'
import type { SupportedLanguage } from '@/types/languages'

interface Props {
  item: AffirmationEntity
  tools?: ReactNode
  className?: string
  hideDate?: boolean
  children?: ReactNode
  link?: string
}

export default function AffirmationCard({ item, tools, className = '', hideDate = false, children, link }: Props) {
  const locale = useLocale() as SupportedLanguage
  const selectedTranslation = (item.translations?.[locale as SupportedLanguage] && {
    text: item.translations[locale as SupportedLanguage],
    language: locale,
  }) ||
    (item.translations?.uk && { text: item.translations.uk, language: 'uk' as SupportedLanguage }) ||
    (item.translations?.en && { text: item.translations.en, language: 'en' as SupportedLanguage }) ||
    (item.translations?.pl && { text: item.translations.pl, language: 'pl' as SupportedLanguage }) || {
      text: '',
      language: locale,
    }
  const { text, language: textLanguage } = selectedTranslation
  const hasSpeakableText = text.trim().length > 0
  const imageUrl = item.imageUrl
  const currentDate = formatDate(new Date(Date.now()).toISOString())

  const combinedTools = (
    <>
      {hasSpeakableText && <PlayButton text={text} language={textLanguage} />}
      {tools}
    </>
  )

  return (
    <Card
      className={`h-full border bg-white ${className}`}
      sup={hideDate ? undefined : currentDate}
      icon={hideDate ? undefined : <Calendar size={12} />}
      aftertext={text}
      tools={combinedTools}
      link={link}
    >
      {children}
      {imageUrl && (
        <div className="mt-1">
          <div className="relative w-full overflow-hidden rounded-md" style={{ paddingTop: '100%' }}>
            <Image
              src={imageUrl}
              alt={text || 'affirmation'}
              fill
              sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
              priority
            />
          </div>
        </div>
      )}
    </Card>
  )
}
