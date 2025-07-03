import { cn } from '@/lib/utils'

type SectionCardProps = {
  title?: string
  subtitle?: string
  children?: React.ReactNode
  className?: string
}

export const SectionCard = ({ title, subtitle, children, className }: SectionCardProps) => {
  return (
    <div className={cn('h-full rounded-default bg-surface-white p-6', className)}>
      <div className="mb-6 flex flex-col gap-2">
        {title && <div className="text-2xl font-semibold">{title}</div>}
        {subtitle && <div className="text-base font-normal">{subtitle}</div>}
      </div>
      {children}
    </div>
  )
}
