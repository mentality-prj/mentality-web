'use client'

import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <div className="relative">
    <SwitchPrimitives.Root
      className={cn(
        'peer relative z-10 inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#563999] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-[#8E8EA4] hover:data-[state=checked]:bg-primary-hover active:data-[state=checked]:bg-primary-pressed disabled:data-[state=checked]:bg-[#E4E3E8] disabled:data-[state=unchecked]:bg-[#E4E3E8]',
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'background-alt-white pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0'
        )}
      />
    </SwitchPrimitives.Root>
    <div className="peer-active:peer-data-[state=checked]:bg-secondary-pressed absolute left-[-4px] top-[-4px] z-0 h-8 w-8 rounded-full transition-transform peer-data-[state=checked]:translate-x-5 peer-hover:peer-data-[state=checked]:bg-[#F0EDFF] peer-hover:peer-data-[state=unchecked]:bg-[#F2F1F3] peer-active:peer-data-[state=unchecked]:bg-[#E4E3E8]"></div>
  </div>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
