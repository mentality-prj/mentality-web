import { ReactNode } from 'react'

import { StaticCard } from '@/components/shared/Cards/StaticCard'

type Props = {
  title: string
  description: string
  action?: ReactNode
}

export function ResearchStateCard({ title, description, action }: Props) {
  return (
    <StaticCard className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-textcolor-primary">{title}</h2>
        <p className="mt-2 text-sm text-textcolor-secondary">{description}</p>
      </div>
      {action}
    </StaticCard>
  )
}
