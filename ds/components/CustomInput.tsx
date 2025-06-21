import React from 'react'
import { TriangleAlert } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Input } from '../shadcn/input'
import { Label } from '../shadcn/label'

type CustomInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  errorMsg?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, label, errorMsg, helperText, id, leftIcon, rightIcon, ...inputProps }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-textcolor-secondary">{leftIcon}</div>
          )}
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-textcolor-secondary">{rightIcon}</div>
          )}
          <Input
            className={cn(
              'h-12 w-full rounded-md border border-outline-secondary bg-surface-white px-4 text-sm placeholder-textcolor-tertiary caret-primary shadow-none outline-none hover:border-primary-hover focus:placeholder-transparent focus-visible:border-primary-focus focus-visible:ring-0 disabled:border-disable [&:not(:placeholder-shown)]:border-primary [&:not(:placeholder-shown)]:caret-textcolor-primary',
              leftIcon && 'pl-12', // 16px left input padding + 24px icon size + 8px gap between icon & text
              rightIcon && 'pr-12',
              className,
              !!errorMsg && 'border-outline-error'
            )}
            ref={ref}
            id={id}
            {...inputProps}
          />
        </div>
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
