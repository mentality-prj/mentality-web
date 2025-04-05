import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center  justify-center gap-2 whitespace-nowrap rounded-[80px] text-base leading-none font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1  disabled:pointer-events-none ring-offset-[3px] ring-offset-background ring-ring [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0 disabled:text-disabled-foreground disabled:bg-disabled disabled:border-disabled-foreground border-primary hover:border-[#734CCC] focus:border-[#563999]  active:border-[#3A2666]',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary-hover focus:bg-primary-focus active:bg-primary-active',
        secondary:
          'bg-transparent text-secondary-foreground border-1 hover:bg-secondary-hover hover:text-secondary-foreground-hover  focus:bg-secondary-focus focus:text-secondary-foreground-focus  active:bg-secondary-active active:text-secondary-foreground-active',
      },
      size: {
        default: 'h-12 py-4 px-6',
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
