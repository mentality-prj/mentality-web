'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

import { Switch } from '@/ds/shadcn/switch'

export default function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="flex items-center gap-2">
      <Switch checked={resolvedTheme === 'light'} onCheckedChange={(checked) => setTheme(checked ? 'light' : 'dark')} />
    </div>
  )
}
