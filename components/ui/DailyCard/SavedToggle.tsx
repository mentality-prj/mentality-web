'use client'

import toast from 'react-hot-toast'

import { CheckIcon } from '@/ds/icons/check'
import { StarIcon } from '@/ds/icons/star'
import { Toggle } from '@/ds/shadcn/toggle'

export const SavedToggle = ({ toastText, saveFunc }: { toastText?: string; saveFunc?: () => void }) => {
  return (
    <Toggle
      onPressedChange={(pressed) => {
        if (pressed) {
          saveFunc?.()
          toast.custom(
            <div className="flex items-center gap-2 rounded-sm bg-outline-success px-8 py-4 text-reversed [&_svg]:size-6">
              {toastText} <CheckIcon />
            </div>,
            {
              position: 'bottom-right',
              duration: 3000,
            }
          )
        }
      }}
      className="fill-transparent p-0 text-textcolor-primary data-[state='on']:fill-primary data-[state='on']:text-primary [&_svg]:size-6"
    >
      <StarIcon />
    </Toggle>
  )
}
