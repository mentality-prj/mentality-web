import { useEffect } from 'react'

import { logger } from '@/lib/logger'

type Props = {
  onClick?: () => void
  className?: string
}

export default function FullScreenBackdrop({ onClick, className = '' }: Props) {
  // Backdrop: add keyboard support and ARIA role for accessibility.
  useEffect(() => {
    if (!onClick) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        try {
          onClick()
        } catch (e) {
          logger.error('FullScreenBackdrop: consumer onClick handler threw', {
            error: e instanceof Error ? e.message : String(e),
          })
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClick])

  return (
    <div
      className={`fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm ${className}`}
      onClick={onClick}
      aria-hidden="true"
      role="presentation"
    />
  )
}
