'use client'
import { ReactNode } from 'react'
import { Calendar } from 'lucide-react'
import Image from 'next/image'

import Card from '@/components/Cards/Card'
import { formatDate } from '@/helpers/data'
import { AffirmationEntity } from '@/types/api-responses'

interface Props {
  item: AffirmationEntity
  tools?: ReactNode
  className?: string
}

export default function AffirmationCard({ item, tools, className = '' }: Props) {
  const text = item.translations?.uk || item.translations?.en || item.translations?.pl || ''
  const imageUrl = item.imageUrl
  const createdAt = formatDate(item.createdAt)

  return (
    <Card
      className={`h-full border bg-white ${className}`}
      sup={createdAt}
      icon={<Calendar size={12} />}
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
              className="rounded-md object-contain p-2"
            />
          </div>
        </div>
      )}
    </Card>
  )
}
