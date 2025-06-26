import { cn } from '@/lib/utils'

type SectionCardProps = {
  title: string
  subtitle: string
  children: React.ReactNode
  className?: string
}

export const SectionCard = ({ title, subtitle, children, className }: SectionCardProps) => {
  return (
    <div className={cn('w-full rounded-default bg-surface-white p-8', className)}>
      <div className="flex flex-col gap-2">
        <div className="text-2xl font-semibold">{title}</div>
        <div className="text-base font-normal">{subtitle}</div>
      </div>
      {children}
    </div>
  )
}
