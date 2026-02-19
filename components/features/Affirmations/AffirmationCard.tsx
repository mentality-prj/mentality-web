'use client'
import { ReactNode } from 'react'
import { Calendar } from 'lucide-react'
import Image from 'next/image'

import Card from '@/components/shared/Cards/Card'
import { formatDate } from '@/helpers/data'
import { AffirmationEntity } from '@/types/api-responses'

interface Props {
  item: AffirmationEntity
  tools?: ReactNode
  className?: string
  hideDate?: boolean
}

export default function AffirmationCard({ item, tools, className = '', hideDate = false }: Props) {
  const text = item.translations?.uk || item.translations?.en || item.translations?.pl || ''
  const imageUrl = item.imageUrl
  const currentDate = formatDate(new Date(Date.now()).toISOString())

  return (
    <Card
      className={`h-full border bg-white ${className}`}
      sup={hideDate ? undefined : currentDate}
      icon={hideDate ? undefined : <Calendar size={12} />}
      aftertext={text}
      tools={tools}
    >
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
