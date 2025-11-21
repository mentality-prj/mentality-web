import { cn } from '@/lib/utils'

interface PageTitleProps {
  title: string
  subtitle?: string
  className?: string
}

export const PageTitle = ({ title, subtitle, className }: PageTitleProps) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="text-2xl font-semibold">{title}</div>
      {subtitle && <div className="text-base font-medium text-textcolor-secondary">{subtitle}</div>}
    </div>
  )
}
