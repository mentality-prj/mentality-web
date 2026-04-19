'use client'

import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Circle } from 'lucide-react'

import { cn } from '@/lib/utils'

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn('grid gap-xs', className)} {...props} ref={ref} />
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
        'border-iconcolor-primary hover:bg-secondary-hover focus-visible:bg-secondary-focus focus-visible:ring-secondary-focus active:bg-secondary-pressed disabled:border-disable focus-visible:data-[state=checked]:border-primary-focus focus-visible:data-[state=checked]:bg-secondary-focus disabled:data-[state=checked]:border-disable group m-[3px] aspect-square h-5 w-5 rounded-full border-[1.5px] bg-transparent text-transparent outline-none hover:border-primary focus-visible:border-primary focus-visible:ring-4 active:border-primary disabled:cursor-not-allowed data-[state=checked]:border-primary data-[state=checked]:bg-transparent hover:data-[state=checked]:border-primary-hover active:data-[state=checked]:border-primary-pressed',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="group-focus-visible:fill-primary-focus group-disabled:fill-disable h-3 w-3 fill-primary group-hover:fill-primary-hover group-active:fill-primary-pressed" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
