import { ComponentProps } from 'react'

import { Label } from '@/ds/shadcn/label'
import { Textarea } from '@/ds/shadcn/textarea'
import { cn } from '@/lib/utils'

type Props = ComponentProps<typeof Textarea> & {
  label?: string
  helper?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function TextareaWithLabel({ label, helper, id = 'textarea', leftIcon, rightIcon, ...props }: Props) {
  return (
    <div className="flex flex-col">
      {label && (
        <p className="mb-2">
          <Label htmlFor={id}> {label} </Label>
        </p>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-textcolor-secondary">{leftIcon}</div>
        )}
        {rightIcon && <div className="absolute right-4 top-3 text-textcolor-secondary">{rightIcon}</div>}
        <Textarea
          className={cn(
            leftIcon && 'pl-12', // 16px left input padding + 24px icon size + 8px gap between icon & text
            rightIcon && 'pr-12'
          )}
          id={id}
          {...props}
        ></Textarea>
      </div>
      {helper && <p className="mt-1 h-[14px] text-[12px] font-normal text-textcolor-tertiary">{helper}</p>}
    </div>
  )
}
export default TextareaWithLabel
