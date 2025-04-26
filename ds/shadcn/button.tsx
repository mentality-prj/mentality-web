import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xxlg text-base font-semibold leading-none transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-4 disabled:pointer-events-none disabled:bg-disable disabled:text-textcolor-tertiary disabled:border-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:me-2',
  {
    variants: {
      variant: {
        default:
          'h-12 px-6 py-4 bg-primary text-reversed hover:bg-primary-hover focus:bg-primary-focus focus-visible:ring-primary-focus active:bg-primary-pressed [&_svg]:size-6 [&_svg]:ms-8',
        secondary:
          'h-12 px-6 py-4 bg-transparent text-primary border border-primary hover:bg-secondary-hover focus:bg-secondary-focus focus-visible:ring-primary active:bg-secondary-pressed [&_svg]:size-8  [&_svg]:ms-6',
        textIconButton:
          'h-10 px-3 py-2 bg-transparent text-textcolor-primary hover:text-primary-hover focus:text-primary-focus focus-visible:ring-primary-focus focus-visible:ring-offset-0 active:text-primary-pressed [&_svg]:size-6 [&_svg]:ms-3',
      },

      size: {
        default: 'gap-2',
        // small: 'h-6',
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
