'use client'
import { ReactNode } from 'react'
import { Calendar } from 'lucide-react'

import Card from '@/components/Cards/Card'
import { formatDate } from '@/helpers/data'
import { TipEntity } from '@/types/api-responses'

interface Props {
  item: TipEntity
  tools?: ReactNode
  className?: string
}

export default function TipCard({ item, tools, className = '' }: Props) {
  const text = item.translations?.uk || item.translations?.en || item.translations?.pl || ''
  const createdAt = formatDate(item.createdAt)

  return (
    <Card className={`h-full border bg-white ${className}`} sup={createdAt} icon={<Calendar size={12} />} tools={tools}>
      <div className="mt-1">
        <div className="text-sm text-gray-700">{text}</div>
      </div>
    </Card>
  )
}
