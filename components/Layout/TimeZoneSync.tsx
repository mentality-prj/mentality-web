'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { getVerifiedBrowserTimeZone, USER_TIME_ZONE_COOKIE } from '@/utils/timeZone'

/** Align server-rendered day-sensitive views with a browser IANA zone. */
export function TimeZoneSync() {
  const router = useRouter()
  useEffect(() => {
    const sync = () => {
      const zone = getVerifiedBrowserTimeZone()
      if (!zone) return
      const encoded = encodeURIComponent(zone)
      const existing = document.cookie.split('; ').find((item) => item.startsWith(`${USER_TIME_ZONE_COOKIE}=`))
      if (existing?.slice(USER_TIME_ZONE_COOKIE.length + 1) === encoded) return
      document.cookie = `${USER_TIME_ZONE_COOKIE}=${encoded}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
      router.refresh()
    }
    sync()
    window.addEventListener('focus', sync)
    document.addEventListener('visibilitychange', sync)
    return () => {
      window.removeEventListener('focus', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [router])
  return null
}
