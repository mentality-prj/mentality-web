import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-semibold leading-none transition-colors focus:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:text-textcolor-tertiary [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'h-12 px-6 py-4 bg-primary text-reversed hover:bg-primary-hover focus:bg-primary-focus focus-visible:ring-primary-focus active:bg-primary-pressed focus-visible:ring-offset-4 disabled:bg-disable',
        secondary:
          'h-12 px-6 py-4 bg-transparent text-primary border border-primary hover:bg-secondary-hover focus:bg-secondary-focus focus-visible:ring-primary-focus active:bg-secondary-pressed disabled:border disabled:border-outline-secondary focus-visible:ring-offset-4 disabled:bg-disable',
        textIconButton:
          'h-10 px-3 py-2 bg-transparent text-textcolor-primary hover:text-primary-hover focus:text-primary-focus focus-visible:ring-primary-focus active:text-primary-pressed',
        textButton:
          'h-8 px-3 bg-transparent text-primary hover:bg-secondary-hover focus:bg-secondary-focus focus-visible:ring-primary-focus active:bg-secondary-pressed disabled:bg-disable',
        linkButton:
          'px-2 py-1 bg-transparent text-textcolor-primary hover:text-primary-hover focus:text-primary-focus focus-visible:ring-primary-focus focus-visible:ring-offset-1 active:text-primary-pressed underline [text-underline-offset:3px] decoration-1',
        IconButton:
          'bg-transparent text-iconcolor-primary hover:bg-secondary-hover hover:text-primary focus:bg-secondary-focus focus:text-primary focus-visible:ring-primary-focus active:bg-secondary-pressed',
      },

      size: {
        default: 'gap-2',
        icon: 'h-8 w-8 py-0 px-0 rounded-full [&_svg]:w-6 [&_svg]:h-6',
        iconSm: 'h-6 w-6 py-0 px-0 rounded-full [&_svg]:w-4 [&_svg]:h-4',
      },
    },
    defaultVariants: {
      variant: 'default',
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
