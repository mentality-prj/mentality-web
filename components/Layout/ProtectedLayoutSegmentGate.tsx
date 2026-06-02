'use client'

import { ReactNode } from 'react'

import { usePathname } from '@/i18n/navigation'

function matchesDetachedPrefix(pathname: string, detachedPrefix: string): boolean {
  return pathname === detachedPrefix || pathname.startsWith(`${detachedPrefix}/`)
}

export default function ProtectedLayoutSegmentGate({
  defaultContent,
  detachedContent,
  detachedPrefix,
}: {
  defaultContent: ReactNode
  detachedContent: ReactNode
  detachedPrefix: string
}) {
  const pathname = usePathname()

  return matchesDetachedPrefix(pathname, detachedPrefix) ? detachedContent : defaultContent
}
