import React from 'react'
import { TriangleAlert } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Input } from '../shadcn/input'
import { Label } from '../shadcn/label'

type CustomInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  errorMsg?: string
  helperText?: string
}

export const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, label, errorMsg, helperText, id, ...inputProps }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && <Label htmlFor={id}>{label}</Label>}
        <Input
          className={cn(
            'h-12 w-full max-w-[360px] rounded-md border-[1px] border-outline-secondary bg-surface-white px-4 py-[14px] text-sm placeholder-textcolor-tertiary caret-primary shadow-none outline-none hover:border-primary-hover focus:placeholder-transparent focus-visible:border-primary-focus focus-visible:ring-0 disabled:border-disable [&:not(:placeholder-shown)]:border-primary [&:not(:placeholder-shown)]:caret-textcolor-primary',
            className,
            !!errorMsg && 'border-outline-error'
          )}
          ref={ref}
          id={id}
          {...inputProps}
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

CustomInput.displayName = 'CustomInput'
