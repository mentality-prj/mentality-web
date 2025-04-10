import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

const Input = forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      // TODO: fix styles and add styles for disabled
      className={cn(
        'flex h-12 w-full rounded-xl border border-gray-20 bg-transparent px-4 text-base font-normal text-black transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-black placeholder:text-gray-30 placeholder-shown:border-gray-30 hover:border-primary-hover focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
