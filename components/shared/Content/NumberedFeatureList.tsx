import { cn } from '@/lib/utils'

export type NumberedFeatureListItem = {
  key: string
  title: string
  description?: string
}

type NumberedFeatureListProps = {
  items: readonly NumberedFeatureListItem[]
  className?: string
  itemClassName?: string
  numberClassName?: string
  titleClassName?: string
  descriptionClassName?: string
  dividerClassName?: string
}

export function NumberedFeatureList({
  items,
  className,
  itemClassName,
  numberClassName,
  titleClassName,
  descriptionClassName,
  dividerClassName,
}: NumberedFeatureListProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      {items.map((item, index) => {
        const hasDivider = index < items.length - 1

        return (
          <div key={item.key} className={cn('grid grid-cols-[4rem_minmax(0,1fr)] gap-5', itemClassName)}>
            <div className="py-4">
              <span
                aria-hidden="true"
                className={cn(
                  'text-[1.85rem] font-semibold leading-none tracking-[-0.04em] text-textcolor-primary/30',
                  numberClassName
                )}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            <div className={cn('min-w-0 py-4', hasDivider && cn('border-b border-black/[0.08]', dividerClassName))}>
              <p
                className={cn(
                  'text-sm font-medium leading-relaxed text-textcolor-primary md:text-base',
                  titleClassName
                )}
              >
                {item.title}
              </p>
              {item.description && (
                <p
                  className={cn(
                    'mt-1 text-sm leading-relaxed text-textcolor-secondary md:text-base',
                    descriptionClassName
                  )}
                >
                  {item.description}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
