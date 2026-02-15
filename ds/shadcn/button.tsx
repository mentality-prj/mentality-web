import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

// Shared style patterns for consistency and reusability
const interactiveStates = {
  primary: 'hover:bg-primary-hover focus:bg-primary-focus active:bg-primary-pressed',
  secondary: 'hover:bg-secondary-hover focus:bg-secondary-focus active:bg-secondary-pressed',
  destructive: 'hover:bg-destructive-hover focus:bg-destructive-focus active:bg-destructive-pressed',
  textPrimary: 'hover:text-primary-hover focus:text-primary-focus active:text-primary-pressed',
}

const focusRing = {
  primary: 'focus-visible:ring-primary-focus focus-visible:ring-offset-4',
  primarySmall: 'focus-visible:ring-primary-focus focus-visible:ring-offset-1',
  destructive: 'focus-visible:ring-destructive-focus focus-visible:ring-offset-4',
}

const disabledStates = {
  solid: 'disabled:bg-disable',
  bordered: 'disabled:border disabled:border-outline-secondary disabled:bg-disable',
}

// Button variant styles
const defaultButtonStyles = `px-6 bg-primary text-reversed ${interactiveStates.primary} ${focusRing.primary} ${disabledStates.solid}`

const secondaryButtonStyles = `px-6 bg-transparent text-primary border border-primary ${interactiveStates.secondary} ${focusRing.primary} ${disabledStates.bordered}`

const destructiveButtonStyles = `px-6 bg-destructive text-reversed ${interactiveStates.destructive} ${focusRing.destructive} ${disabledStates.solid}`

const textButtonBaseStyles = `bg-transparent ${interactiveStates.textPrimary} ${focusRing.primary}`

const ghostButtonStyles = `px-4 bg-transparent text-primary border border-border hover:bg-secondary-hover/30 focus:bg-secondary-focus/20 ${focusRing.primary} active:bg-secondary-pressed/20`

const textButtonStyles = `px-3 rounded-sm bg-transparent text-primary ${interactiveStates.secondary} ${focusRing.primary} ${disabledStates.solid}`

const linkButtonStyles = `px-2 bg-transparent text-textcolor-primary ${interactiveStates.textPrimary} ${focusRing.primarySmall} underline [text-underline-offset:3px] decoration-1`

const iconButtonStyles = `bg-transparent text-iconcolor-primary hover:opacity-75 focus-visible:ring-offset-0 ${interactiveStates.secondary} ${focusRing.primary} ${disabledStates.solid} rounded-full`

const volumeButtonStyles = `px-6 py-4 bg-primary text-primary-foreground ${interactiveStates.primary} ${focusRing.primary} shadow-md [background-image:linear-gradient(45deg,rgba(31,210,192,0)_60%,rgba(31,210,192,0.5)_80%,rgba(255,255,255,0.5)_100%)] [box-shadow:inset_0px_2px_4px_rgba(255,255,255,0.3)] [-webkit-font-smoothing:antialiased] [-moz-osx-font-smoothing:grayscale] disabled:[background-image:none]`

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-normal rounded-full text-base leading-none transition-colors focus:outline-none disabled:pointer-events-none disabled:bg-background-muted disabled:text-tertiary [&_svg]:pointer-events-none [&_svg]:shrink-0 h-10',
  {
    variants: {
      variant: {
        // Standard button variants
        ghost: ghostButtonStyles,
        default: defaultButtonStyles,
        secondary: secondaryButtonStyles,
        destructive: destructiveButtonStyles,

        // Text-based button variants
        textIconButton: `h-10 px-3 text-textcolor-primary ${textButtonBaseStyles}`,
        textButton: textButtonStyles,
        linkButton: linkButtonStyles,

        // Icon button variants
        iconTool: 'icon-tool icon-tool-text',
        iconButton: iconButtonStyles,

        // Special variants
        volume: volumeButtonStyles,
      },

      size: {
        // Text button sizes
        default: 'h-10 text-base gap-1 [&_svg]:h-6',
        base: 'h-10 text-sm gap-1 [&_svg]:h-4',
        large: 'h-14 px-6 text-lg gap-xs [&_svg]:h-6',
        medium: 'h-10 px-4 text-sm gap-1 [&_svg]:h-5',
        small: 'h-8 px-2 text-xs gap-1 [&_svg]:h-4',

        // Icon button sizes
        iconBig: 'h-12',
        icon: 'h-8 w-8 rounded-full [&_svg]:w-6 [&_svg]:h-6',
        iconSm: 'h-6 w-6 p-0 rounded-full [&_svg]:w-4 [&_svg]:h-4',
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
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
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
