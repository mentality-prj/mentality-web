import { cn } from '@/lib/utils'

interface PageTitleProps {
  title: string
  subtitle?: string
  className?: string
}

export const PageTitle = ({ title, subtitle, className }: PageTitleProps) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <h1>{title}</h1>
      {subtitle && <h3>{subtitle}</h3>}
    </div>
  )
}
