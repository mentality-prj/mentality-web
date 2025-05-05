'use client'

import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Circle } from 'lucide-react'

import { cn } from '@/lib/utils'

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} ref={ref} />
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'group m-[3px] aspect-square h-5 w-5 rounded-full border-[1.5px] border-iconcolor-primary bg-transparent text-transparent outline-none hover:border-primary hover:bg-secondary-hover focus-visible:border-primary focus-visible:bg-secondary-focus focus-visible:ring-4 focus-visible:ring-secondary-focus active:border-primary active:bg-secondary-pressed disabled:cursor-not-allowed disabled:border-disable data-[state=checked]:border-primary data-[state=checked]:bg-transparent hover:data-[state=checked]:border-primary-hover focus-visible:data-[state=checked]:border-primary-focus focus-visible:data-[state=checked]:bg-secondary-focus active:data-[state=checked]:border-primary-pressed disabled:data-[state=checked]:border-disable',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-3 w-3 fill-primary group-hover:fill-primary-hover group-focus-visible:fill-primary-focus group-active:fill-primary-pressed group-disabled:fill-disable" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
