'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { getLocalDayKey, getVerifiedBrowserTimeZone, USER_TIME_ZONE_COOKIE } from '@/utils/timeZone'

/** Align server-rendered day-sensitive views with a browser IANA zone. */
export function TimeZoneSync() {
  const router = useRouter()
  useEffect(() => {
    let lastLocalDay: string | null = null
    const sync = () => {
      const zone = getVerifiedBrowserTimeZone()
      if (!zone) return
      const localDay = getLocalDayKey(new Date(), zone)
      const dayChanged = lastLocalDay !== null && lastLocalDay !== localDay
      lastLocalDay = localDay
      const encoded = encodeURIComponent(zone)
      const existing = document.cookie.split('; ').find((item) => item.startsWith(`${USER_TIME_ZONE_COOKIE}=`))
      if (existing?.slice(USER_TIME_ZONE_COOKIE.length + 1) !== encoded) {
        document.cookie = `${USER_TIME_ZONE_COOKIE}=${encoded}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
        router.refresh()
      } else if (dayChanged) {
        router.refresh()
      }
    }
    sync()
    // A long-lived tab must move to the next local day without requiring a reload.
    const interval = window.setInterval(sync, 60_000)
    window.addEventListener('focus', sync)
    document.addEventListener('visibilitychange', sync)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [router])
  return null
}
