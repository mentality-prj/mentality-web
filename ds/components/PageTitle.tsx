import { cn } from '@/lib/utils'

interface PageTitleProps {
  title: string
  subtitle?: string
  className?: string
  titleClassName?: string
  subtitleClassName?: string
}

export const PageTitle = ({ title, subtitle, className, titleClassName, subtitleClassName }: PageTitleProps) => {
  return (
    <div className={cn('flex flex-col gap-xs', className)}>
      <h1 className={titleClassName}>{title}</h1>
      {subtitle && <h3 className={subtitleClassName}>{subtitle}</h3>}
    </div>
  )
}
