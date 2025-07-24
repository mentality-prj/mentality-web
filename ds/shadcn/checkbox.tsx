'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'h-5 w-5 rounded-xs border border-iconcolor-primary bg-transparent outline-none hover:border-primary hover:bg-secondary-hover hover:ring-2 hover:ring-secondary-hover focus-visible:border-primary focus-visible:bg-secondary-focus focus-visible:ring-1 focus-visible:ring-primary-focus focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-focus active:border-primary active:bg-secondary-pressed active:ring-2 active:ring-secondary-pressed disabled:cursor-not-allowed disabled:border-disable data-[state=checked]:border-primary data-[state=checked]:text-primary',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-primary')}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
