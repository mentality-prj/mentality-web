'use client'
import { ComponentProps } from 'react'

import { Textarea as BaseTextarea } from '@/ds/shadcn/textarea'
import { cn } from '@/lib/utils'

interface Props extends ComponentProps<'textarea'> {
  className?: string
}

export default function StyledTextarea({ className, ...props }: Props) {
  return (
    <BaseTextarea
      className={cn(
        'w-full rounded-sm border p-3 text-sm focus:border-info focus:outline-none focus-visible:ring-info/50',
        'disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
}
