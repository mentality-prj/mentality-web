'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cva, VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const tabsTriggerVariants = cva('text-textcolor-tertiary font-medium px-8', {
  variants: {
    variant: {
      default:
        'active:!bg-primary-pressed active:!text-reversed bg-secondary py-2 rounded-md gap-xs hover:bg-primary-hover hover:text-reversed data-[state=active]:bg-primary data-[state=active]:text-reversed focus-visible:bg-primary-focus focus-visible:outline-none focus-visible:text-reversed focus-visible:ring-1 focus-visible:ring-primary-focus ring-offset-[3px]',
      secondary:
        'active:!text-primary-pressed active:!border-primary-pressed relative text-sm px-2 py-1 border-b-[1px] border-disable hover:text-primary-hover hover:border-primary-hover data-[state=active]:text-primary data-[state=active]:border-primary focus-visible:text-primary-focus focus-visible:border-primary-focus focus-visible:outline-transparent after:content-[""] after:absolute after:inset-0 after:rounded-full focus-visible:after:ring-1 after:ring-primary-focus after:top-[-5px] after:left-[-7px] after:right-[-7px] after:bottom-[-5px]',
      grey: 'inline-flex select-none rounded-md px-6 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 text-remark hover:bg-background-alt data-[state=active]:bg-primary data-[state=active]:text-reversed data-[state=active]:font-normal data-[state=active]:shadow-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const Tabs = TabsPrimitive.Root

type TabsListVariant = VariantProps<typeof tabsTriggerVariants>['variant']

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: TabsListVariant
}

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, children, variant, ...props }, ref) => {
    type ChildWithVariant = React.ReactElement<{ variant?: TabsListVariant }>

    const childrenWithVariant = React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child
      // don't override explicit variant on child (treat null/undefined as absent)
      const el = child as ChildWithVariant
      if ('variant' in (el.props ?? {}) && el.props.variant != null) return el
      return React.cloneElement(el, { variant })
    })

    return (
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          `${variant === 'grey' ? 'rounded-md bg-background-muted p-2' : ''} text-muted-foreground flex w-full items-center justify-start gap-xs`,
          className
        )}
        {...props}
      >
        {childrenWithVariant}
      </TabsPrimitive.List>
    )
  }
)
TabsList.displayName = 'TabsList'

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>, VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, variant, ...props }, ref) => {
    return <TabsPrimitive.Trigger ref={ref} className={cn(tabsTriggerVariants({ variant }), className)} {...props} />
  }
)

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => <TabsPrimitive.Content ref={ref} className={cn('mt-2', className)} {...props} />)

TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsContent, TabsList, TabsTrigger }
