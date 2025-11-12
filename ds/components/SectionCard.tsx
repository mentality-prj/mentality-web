import { cn } from '@/lib/utils'

type SectionCardProps = {
  title?: string
  subtitle?: string
  subtitlePrefix?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export const SectionCard = ({ title, subtitle, subtitlePrefix, children, className }: SectionCardProps) => {
  return (
    <div className={cn('h-full rounded-default bg-surface-white p-8', className)}>
      {(title || subtitle) && (
        <div className="mb-6 flex flex-col gap-2">
          {title && <div className="text-2xl font-semibold">{title}</div>}
          {(subtitle || subtitlePrefix) && (
            <div className="flex flex-row gap-2 text-base font-normal text-textcolor-secondary">
              {subtitlePrefix && <span>{subtitlePrefix}</span>}
              {subtitle && <span>{subtitle}</span>}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
