import { cn } from '@/lib/utils'

type ImpactMetricCardProps = {
  highlightValue: string
  highlightLabel: string
  title: string
  description: string
  className?: string
  highlightClassName?: string
}

export function ImpactMetricCard({
  highlightValue,
  highlightLabel,
  title,
  description,
  className,
  highlightClassName,
}: ImpactMetricCardProps) {
  return (
    <div className={cn('flex h-full flex-col rounded-[28px] p-5 shadow-sm md:p-8', className)}>
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex min-h-[5rem] items-start gap-3 md:min-h-[7rem] md:gap-5">
          <div className="min-w-[6rem] space-y-1 md:min-w-[8.5rem]">
            <p
              className={cn(
                'text-4xl font-bold leading-none tracking-tight tablet:text-5xl md:text-6xl',
                highlightClassName
              )}
            >
              {highlightValue}
            </p>
            <p className="max-w-[7rem] text-xs font-medium leading-tight text-textcolor-secondary/85">
              {highlightLabel}
            </p>
          </div>

          <div className="mt-1 h-14 w-px bg-current opacity-15" />

          <div className="min-w-0 space-y-2 pt-2">
            <h3 className="landing-card-title max-tablet:text-xl">{title}</h3>
          </div>
        </div>

        <p className="mt-2 text-base leading-relaxed text-textcolor-secondary md:mt-6">{description}</p>
      </div>
    </div>
  )
}
