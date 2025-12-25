import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-normal rounded-md text-base font-semibold leading-none transition-colors focus:outline-none disabled:pointer-events-none disabled:text-textcolor-tertiary [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'px-6 py-4 bg-primary text-reversed hover:bg-primary-hover focus:bg-primary-focus focus-visible:ring-primary-focus active:bg-primary-pressed focus-visible:ring-offset-4 disabled:bg-disable',
        secondary:
          'px-6 py-4 bg-transparent text-primary border border-primary hover:bg-secondary-hover focus:bg-secondary-focus focus-visible:ring-primary-focus active:bg-secondary-pressed disabled:border disabled:border-outline-secondary focus-visible:ring-offset-4 disabled:bg-disable',
        destructive:
          'px-6 py-4 bg-destructive text-reversed hover:bg-destructive-hover focus:bg-destructive-focus focus-visible:ring-destructive-focus active:bg-destructive-pressed focus-visible:ring-offset-4 disabled:bg-disable',
        cta: 'px-6 py-4 rounded-3xl bg-cta text-reversed hover:bg-cta-hover focus:bg-cta-focus active:bg-cta-pressed focus-visible:ring-cta-focus focus-visible:ring-offset-4 shadow-md',
        textIconButton:
          'h-10 px-3 py-2 bg-transparent text-textcolor-primary hover:text-primary-hover focus:text-primary-focus focus-visible:ring-primary-focus active:text-primary-pressed',
        textButton:
          'py-2 px-3 rounded-sm bg-transparent text-primary hover:bg-secondary-hover focus:bg-secondary-focus focus-visible:ring-primary-focus active:bg-secondary-pressed disabled:bg-disable',
        linkButton:
          'px-2 py-1 bg-transparent text-textcolor-primary hover:text-primary-hover focus:text-primary-focus focus-visible:ring-primary-focus focus-visible:ring-offset-1 active:text-primary-pressed underline [text-underline-offset:3px] decoration-1',
        iconButton:
          'shrink-0 bg-border text-iconcolor-primary hover:opacity-75 focus-visible:ring-offset-0 hover:bg-secondary-hover focus:bg-secondary-focus focus-visible:ring-primary-focus active:bg-secondary-pressed disabled:bg-disable rounded-full',
        volume:
          'px-6 py-4 rounded-3xl bg-cta text-reversed hover:bg-cta-hover focus:bg-cta-focus active:bg-cta-pressed focus-visible:ring-cta-focus focus-visible:ring-offset-4 shadow-md [background-image:linear-gradient(45deg,rgba(31,210,192,0)_60%,rgba(31,210,192,0.5)_80%,rgba(255,255,255,0.5)_100%)] [box-shadow:inset_0px_2px_4px_rgba(255,255,255,0.3)]',
      },

      size: {
        default: 'gap-1 [&_svg]:h-6',
        base: 'gap-1 [&_svg]:h-4',
        iconBig: 'h-12 ',
        icon: 'h-8 w-8 rounded-full [&_svg]:w-6 [&_svg]:h-6',
        iconSm: 'h-6 w-6 py-0 px-0 rounded-full [&_svg]:w-4 [&_svg]:h-4',
        iconButton: 'h-10 w-10',
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
