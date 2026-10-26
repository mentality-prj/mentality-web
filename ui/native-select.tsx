import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Shared design-system styling for semantic native selects.
 * Keep native onChange / required / keyboard navigation so public lead forms
 * preserve ordinary HTML form behavior without a Radix state adapter.
 */
const NativeSelect = React.forwardRef<HTMLSelectElement, React.ComponentProps<'select'>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'flex min-h-11 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-textcolor-primary focus-visible:border-primary-focus focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
)
NativeSelect.displayName = 'NativeSelect'

export { NativeSelect }
