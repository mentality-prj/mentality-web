import { cva } from 'class-variance-authority'

export const mainVariants = cva('old-paper min-w-0 min-h-screen w-full flex-1 flex-col items-start justify-between', {
  variants: {
    layout: {
      withSidebar: '',
      noSidebar: 'rounded-none',
    },
  },
  defaultVariants: {
    layout: 'withSidebar',
  },
})
