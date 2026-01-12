'use client'
import { ReactNode, useState } from 'react'
import { Calendar, X } from 'lucide-react'
import { useLocale } from 'next-intl'

import Card from '@/components/Cards/Card'
import TextRenderer from '@/components/Content/TextRenderer'
import FullScreenBackdrop from '@/components/FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop'
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
        <>
          <FullScreenBackdrop onClick={() => setOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl">
              <Card
                className="p-6"
                sup={createdAt}
                icon={<Calendar size={12} />}
                tools={
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setOpen(false)}
                    className="tool-icon tool-icon-text ml-4 rounded p-1"
                  >
                    <X className="h-5 w-5" />
                  </button>
                }
                title={title}
                text={annotation}
                remark={item.category}
                tags={item.tags}
              >
                <section>
                  {/* Render parsed content blocks (paragraphs, lists, quotes) */}
                  <TextRenderer text={description} />
                </section>
              </Card>
            </div>
          </div>
        </>
      )}
    </>
  )
}
