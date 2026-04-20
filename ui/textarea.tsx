import * as React from 'react'

import { cn } from '@/lib/utils'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex w-full resize-none rounded-md border bg-transparent px-4 py-3 text-sm font-normal text-tertiary hover:border-primary-hover focus:border-primary-pressed focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:border-border disabled:bg-background-muted',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
