'use client'
import { ReactNode, useState } from 'react'
import { Calendar, X } from 'lucide-react'
import { useLocale } from 'next-intl'

import Card from '@/components/Cards/Card'
import FullScreenBackdrop from '@/components/FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop'
import { formatDate } from '@/helpers/data'
import { TipEntity } from '@/types/api-responses'
import type { SupportedLanguage } from '@/types/languages'

interface Props {
  item: TipEntity
  tools?: ReactNode
  className?: string
}

export default function TipCard({ item, tools, className = '' }: Props) {
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
        <>
          <FullScreenBackdrop onClick={() => setOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl">
              <Card
                className="p-6"
                sup={createdAt}
                icon={<Calendar size={12} />}
                text={text}
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
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}
