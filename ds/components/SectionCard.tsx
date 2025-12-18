import { cn } from '@/lib/utils'

type SectionCardProps = {
  title?: string
  subtitle?: string
  subtitlePrefix?: React.ReactNode
  children?: React.ReactNode
  className?: string
  titleClassName?: string
  decoration?: React.ReactNode
  type?: 'default' | 'info' | 'alert' | 'success'
}

export const SectionCard = ({
  title,
  subtitle,
  subtitlePrefix,
  children,
  className,
  titleClassName,
  decoration,
  type = 'default',
}: SectionCardProps) => {
  const typeBg =
    type === 'info'
      ? 'bg-surface-cardInfo'
      : type === 'alert'
        ? 'bg-surface-cardAlert'
        : type === 'success'
          ? 'bg-surface-cardSuccess'
          : 'bg-surface-card'
  return (
    <div className={cn(typeBg, 'relative overflow-hidden rounded-default p-8', className)}>
      {decoration && <div className="pointer-events-none absolute inset-0">{decoration}</div>}
      {(title || subtitle) && (
        <div className="relative z-10 mb-6 flex flex-col gap-2">
          {title && <div className={cn('text-2xl font-semibold', titleClassName)}>{title}</div>}
          {(subtitle || subtitlePrefix) && (
            <div className="flex flex-row gap-2 text-base font-normal text-textcolor-secondary">
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
