import * as React from 'react'
import { TriangleAlert } from 'lucide-react'

import { cn } from '@/lib/utils'

type InputProps = React.ComponentProps<'input'> & {
  errorMsg?: string
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, errorMsg, helperText, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <input
          type={type}
          className={cn(
            'h-12 w-full max-w-[360px] rounded-md border-[1px] border-outline-secondary bg-surface-white px-4 py-[14px] text-sm placeholder-textcolor-tertiary caret-primary outline-none hover:border-primary-hover focus:placeholder-transparent focus-visible:border-primary-focus disabled:border-disable [&:not(:placeholder-shown)]:border-primary [&:not(:placeholder-shown)]:caret-textcolor-primary',
            className,
            !!errorMsg && 'border-outline-error'
          )}
          ref={ref}
          {...props}
        />
        {errorMsg && (
          <div className="flex items-center gap-1 text-sm text-red-500">
            <TriangleAlert className="h-4 w-4" />
            {errorMsg}
          </div>
        )}

        {!errorMsg && helperText && <span className="block text-sm text-textcolor-tertiary">{helperText}</span>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
