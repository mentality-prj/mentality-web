import * as React from 'react'

type Props = {
  onClick?: () => void
  className?: string
}

export default function FullScreenBackdrop({ onClick, className = '' }: Props) {
  return (
    <div
      className={`fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm ${className}`}
      onClick={onClick}
      aria-hidden="true"
    />
  )
}
