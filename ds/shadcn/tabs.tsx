'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cva, VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const tabsTriggerVariants = cva('text-textcolor-tertiary font-medium px-8', {
  variants: {
    variant: {
      default:
        'active:!bg-primary-pressed active:!text-reversed bg-secondary py-2 rounded-full gap-3 hover:bg-primary-hover hover:text-reversed data-[state=active]:bg-primary data-[state=active]:text-reversed focus-visible:bg-primary-focus focus-visible:outline-none focus-visible:text-reversed focus-visible:ring-1 focus-visible:ring-primary-focus ring-offset-[3px]',
      secondary:
        'active:!text-primary-pressed active:!border-primary-pressed relative text-[14px]/4 pt-1 pb-[3px] border-b-[1px] border-disable hover:text-primary-hover hover:border-primary-hover data-[state=active]:text-primary data-[state=active]:border-primary focus-visible:text-primary-focus focus-visible:border-primary-focus focus-visible:outline-transparent after:content-[""] after:absolute after:inset-0 after:rounded-full focus-visible:after:ring-1 after:ring-primary-focus after:top-[-5px] after:left-[-7px] after:right-[-7px] after:bottom-[-5px]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'bg-muted text-muted-foreground inline-flex h-9 items-center justify-center rounded-lg p-1',
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, variant, ...props }, ref) => {
    return <TabsPrimitive.Trigger ref={ref} className={cn(tabsTriggerVariants({ variant, className }))} {...props} />
  }
)

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => <TabsPrimitive.Content ref={ref} className={cn('mt-2', className)} {...props} />)

TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsContent, TabsList, TabsTrigger }
