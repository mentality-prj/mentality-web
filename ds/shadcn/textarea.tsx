import * as React from 'react'

import { cn } from '@/lib/utils'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          //'placeholder:text-muted-foreground md:text-sm',
          'disabled:border-disabled disabled:bg-disabled border-outline-secondary text-textcolor-tertiary invalid:border-outline-error focus:border-primary-focus focus:text-primary-focus focus-visible:ring-primary-focus flex w-full resize-none rounded-md border bg-transparent px-4 py-3 text-[14px]/[20px] font-normal invalid:text-textcolor-primary hover:border-primary-hover focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:bg-background-muted',
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
