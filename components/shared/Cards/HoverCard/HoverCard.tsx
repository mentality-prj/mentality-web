'use client'

import { ReactNode, useState } from 'react'
import { Zap } from 'lucide-react'

import Card from '@/components/shared/Cards/Card'
import { SummaryCard } from '@/components/shared/Cards/SummaryCard'
import { wrapInAngleQuotes } from '@/helpers/text.helpers'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { Statuses } from '@/types/status.types'

interface HoverCardProps {
  href: string
  icon?: keyof typeof iconMapHover | ReactNode
  title: string
  description: ReactNode
  center?: boolean
}

export const iconMapHover = {
  zap: <Zap className="opacity-50" color="white" size="64" />,
}

export type IconHoverKey = keyof typeof iconMapHover

export const HoverCard = ({ href, icon, title, description, center }: HoverCardProps) => {
  const [hovered, setHovered] = useState(false)

  const renderedIcon: ReactNode | undefined = typeof icon === 'string' ? iconMapHover[icon as IconHoverKey] : icon
  const align = center ? 'items-center' : ''

  return (
    <Link href={href}>
      <Card
        type={hovered ? Statuses.success : Statuses.default}
        className="w-full min-w-80 border border-white transition-shadow hover:shadow-md md:max-w-xs"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <SummaryCard className={cn('flex gap-3', align)} icon={renderedIcon} title={wrapInAngleQuotes(title)}>
          {description}
        </SummaryCard>
      </Card>
    </Link>
  )
}
