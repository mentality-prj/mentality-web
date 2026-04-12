import { ReactNode } from 'react'

import FullScreenBackdrop from '@/components/shared/FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop'

type Props = {
  labelledBy?: string
  onClose: () => void
  children: ReactNode
}

export function ModalSheet({ labelledBy, onClose, children }: Props) {
  return (
    <>
      <FullScreenBackdrop onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 overflow-hidden md:inset-x-auto md:left-1/2 md:w-[520px] md:-translate-x-1/2"
      >
        {children}
      </div>
    </>
  )
}
