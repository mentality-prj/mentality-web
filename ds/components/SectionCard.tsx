import { cn } from '@/lib/utils'

import { Statuses, StatusType } from '../../types/status.types'

type SectionCardProps = {
  title?: string
  subtitle?: string
  subtitlePrefix?: React.ReactNode
  children?: React.ReactNode
  className?: string
  titleClassName?: string
  decoration?: React.ReactNode
  type?: StatusType
}

function getTypeBg(type: StatusType) {
  switch (type) {
    case Statuses.info:
      return 'bg-info'
    case Statuses.note:
      return 'bg-note'
    case Statuses.support:
      return 'bg-support'
    case Statuses.success:
      return 'bg-success'
    default:
      return 'bg-default'
  }
}

export const SectionCard = ({
  title,
  subtitle,
  subtitlePrefix,
  children,
  className,
  titleClassName,
  decoration,
  type = Statuses.default,
}: SectionCardProps) => {
  const typeBg = getTypeBg(type)

  return (
    <div className={cn(typeBg, 'relative overflow-hidden rounded p-6', className)}>
      {decoration && <div className="pointer-events-none absolute inset-0">{decoration}</div>}
      {(title || subtitle) && (
        <div className="relative z-10 mb-6 flex flex-col gap-xs">
          {title && <h3 className={cn('landing-h3', titleClassName)}>{title}</h3>}
          {(subtitle || subtitlePrefix) && (
            <div className="flex flex-row gap-xs text-base font-normal text-textcolor-secondary">
              {subtitlePrefix && <span className="h-6 w-6 [&>svg]:h-6 [&>svg]:w-6">{subtitlePrefix}</span>}
              {subtitle && <span>{subtitle}</span>}
            </div>
          )}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
