import { cn } from '@/lib/utils'

type ImpactMetricCardProps = {
  percentage: string
  percentageLabel: string
  title: string
  description: string
  className?: string
  percentageClassName?: string
  titleClassName?: string
}

export function ImpactMetricCard({
  percentage,
  percentageLabel,
  title,
  description,
  className,
  percentageClassName,
  titleClassName,
}: ImpactMetricCardProps) {
  return (
    <div className={cn('flex h-full flex-col rounded-[28px] p-8 shadow-sm', className)}>
      <div className="flex min-h-[5rem] items-start gap-5 md:min-h-[7rem]">
        <div className="min-w-[8.5rem] space-y-1">
          <p className={cn('text-5xl font-bold leading-none tracking-tight md:text-6xl', percentageClassName)}>
            {percentage}
          </p>
          <p className="max-w-[7rem] text-xs font-medium leading-tight text-textcolor-secondary/85">
            {percentageLabel}
          </p>
        </div>

        <div className="mt-1 h-14 w-px bg-current opacity-15" />

        <div className="space-y-2 pt-2">
          <h3 className={cn('text-2xl font-semibold leading-snug text-textcolor-primary', titleClassName)}>{title}</h3>
        </div>
      </div>

      <p className="text-base leading-relaxed text-textcolor-secondary">{description}</p>
    </div>
  )
}
