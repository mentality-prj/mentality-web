'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

import { MoonIcon } from '@/ds/icons/moon'
import { Switch } from '@/ds/shadcn/switch'

export default function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="flex items-center overflow-hidden py-2">
      <div className="mr-[10px] pl-4 group-data-[collapsible=icon]:px-1">
        <MoonIcon />
      </div>
      <span>Dark mode</span>
      <Switch
        className="ml-10"
        checked={resolvedTheme === 'dark'}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      />
    </div>
  )
}
