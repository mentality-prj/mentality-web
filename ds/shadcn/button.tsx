import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md leading-none font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-focus disabled:pointer-events-none disabled:text-gray-30 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-pressed disabled:bg-secondary-muted focus-visible:ring-offset-4 focus-visible:bg-primary-focus disabled:bg-gray-90',
        // destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/80',
        secondary:
          'focus-visible:ring-offset-4 focus-visible:border-primary-focus focus-visible:bg-secondary focus-visible:text-primary-focus border border-primary bg-transparent text-primary hover:bg-secondary-hover hover:border-primary-hover hover:text-primary-hover active:bg-secondary-focus active:text-primary-pressed active:border-secondary-pressed disabled:border-gray-30 disabled:bg-gray-90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        // ghost: 'hover:bg-accent hover:text-accent-foreground',
        // link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        // sm: 'h-8 rounded-md px-3 text-xs',
        // lg: 'h-10 rounded-md px-8',
        // icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
