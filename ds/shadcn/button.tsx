import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-normal rounded-full text-base leading-none transition-colors focus:outline-none disabled:pointer-events-none disabled:bg-background-muted disabled:text-tertiary [&_svg]:pointer-events-none [&_svg]:shrink-0 h-10',
  {
    variants: {
      variant: {
        ghost:
          'px-4 bg-transparent text-primary border border-border hover:bg-secondary-hover/30 focus:bg-secondary-focus/20 focus-visible:ring-primary-focus active:bg-secondary-pressed/20',
        default:
          'px-6 bg-primary text-reversed hover:bg-primary-hover focus:bg-primary-focus focus-visible:ring-primary-focus active:bg-primary-pressed focus-visible:ring-offset-4 disabled:bg-disable',
        secondary:
          'px-6 bg-transparent text-primary border border-primary hover:bg-secondary-hover focus:bg-secondary-focus focus-visible:ring-primary-focus active:bg-secondary-pressed disabled:border disabled:border-outline-secondary focus-visible:ring-offset-4 disabled:bg-disable',
        destructive:
          'px-6 bg-destructive text-reversed hover:bg-destructive-hover focus:bg-destructive-focus focus-visible:ring-destructive-focus active:bg-destructive-pressed focus-visible:ring-offset-4 disabled:bg-disable',
        textIconButton:
          'h-10 px-3 bg-transparent text-textcolor-primary hover:text-primary-hover focus:text-primary-focus focus-visible:ring-primary-focus active:text-primary-pressed',
        textButton:
          'px-3 rounded-sm bg-transparent text-primary hover:bg-secondary-hover focus:bg-secondary-focus focus-visible:ring-primary-focus active:bg-secondary-pressed disabled:bg-disable',
        linkButton:
          'px-2 bg-transparent text-textcolor-primary hover:text-primary-hover focus:text-primary-focus focus-visible:ring-primary-focus focus-visible:ring-offset-1 active:text-primary-pressed underline [text-underline-offset:3px] decoration-1',
        iconTool: 'icon-tool icon-tool-text',
        iconButton:
          'shrink-0 bg-border text-iconcolor-primary hover:opacity-75 focus-visible:ring-offset-0 hover:bg-secondary-hover focus:bg-secondary-focus focus-visible:ring-primary-focus active:bg-secondary-pressed disabled:bg-disable rounded-full',
        volume:
          'px-6 py-4 bg-primary text-primary-foreground hover:bg-primary-hover focus:bg-primary-focus active:bg-primary-pressed focus-visible:ring-primary-focus focus-visible:ring-offset-4 shadow-md [background-image:linear-gradient(45deg,rgba(31,210,192,0)_60%,rgba(31,210,192,0.5)_80%,rgba(255,255,255,0.5)_100%)] [box-shadow:inset_0px_2px_4px_rgba(255,255,255,0.3)] [-webkit-font-smoothing:antialiased] [-moz-osx-font-smoothing:grayscale]',
      },

      size: {
        default: 'h-10 text-base gap-1 [&_svg]:h-6',
        base: 'h-10 text-sm gap-1 [&_svg]:h-4',
        large: 'h-14 px-6 text-lg gap-2 [&_svg]:h-6',
        medium: 'h-10 px-4 text-sm gap-1 [&_svg]:h-5',
        small: 'h-8 px-2 text-xs gap-1 [&_svg]:h-4',
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
    compoundVariants: [
      {
        variant: 'iconTool',
        class: 'h-6 w-6',
      },
    ],
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
