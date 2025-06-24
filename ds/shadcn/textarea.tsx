import * as React from 'react'

import { cn } from '@/lib/utils'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          //'placeholder:text-muted-foreground md:text-sm',
          'disabled:border-disabled disabled:bg-disabled flex resize-none rounded-md border border-outline-secondary bg-transparent px-4 py-3 text-[14px]/[20px] font-normal text-textcolor-tertiary invalid:border-outline-error invalid:text-textcolor-primary hover:border-primary-hover focus:border-primary-focus focus:text-primary-focus focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-focus disabled:cursor-not-allowed disabled:bg-[#8E8EA4]',
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
