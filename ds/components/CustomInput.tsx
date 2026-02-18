import React from 'react'
import { TriangleAlert } from 'lucide-react'

import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { cn } from '@/lib/utils'

type CustomInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string
  label?: string
  errorMsg?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onLeftClick?: () => void
  onRightClick?: () => void
}

export const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    { className, label, errorMsg, helperText, id, leftIcon, rightIcon, onLeftClick, onRightClick, ...inputProps },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-1">
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="relative">
          {leftIcon && (
            <button
              type="button"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-textcolor-secondary focus:outline-none"
              onClick={onLeftClick}
              tabIndex={0}
              aria-label="Left icon button"
            >
              {leftIcon}
            </button>
          )}
          {rightIcon && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-textcolor-secondary focus:outline-none"
              onClick={onRightClick}
              tabIndex={0}
              aria-label="Right icon button"
            >
              {rightIcon}
            </button>
          )}
          <Input
            className={cn(
              'placeholder-textcolor-tertiary h-8 w-full rounded-full bg-background text-sm text-primary caret-primary shadow-none outline-none hover:bg-background-soft focus:placeholder-transparent focus-visible:bg-background-soft [&:not(:placeholder-shown)]:caret-textcolor-primary',
              leftIcon && 'pl-8',
              rightIcon && 'pr-8',
              className,
              !!errorMsg && 'border-outline-error'
            )}
            ref={ref}
            id={id}
            {...inputProps}
          />
        </div>
        {errorMsg && (
          <div className="text-outline-error flex items-center gap-1 text-sm">
            <TriangleAlert className="h-4 w-4" />
            {errorMsg}
          </div>
        )}
        {!errorMsg && helperText && <span className="text-textcolor-tertiary block text-sm">{helperText}</span>}
      </div>
    )
  }
)

CustomInput.displayName = 'CustomInput'
