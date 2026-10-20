'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { getLocalDayKey, getVerifiedBrowserTimeZone, millisecondsUntilNextLocalDay, USER_TIME_ZONE_COOKIE } from '@/utils/timeZone'

/** Align server-rendered day-sensitive views with a browser IANA zone. */
export function TimeZoneSync() {
  const router = useRouter()
  useEffect(() => {
    let lastLocalDay: string | null = null
    let midnightTimer: number | null = null
    const sync = () => {
      const zone = getVerifiedBrowserTimeZone()
      if (!zone) return
      const now = new Date()
      const localDay = getLocalDayKey(now, zone)
      const dayChanged = lastLocalDay !== null && lastLocalDay !== localDay
      lastLocalDay = localDay

      // Reschedule on focus and after a DST/zone change. A one-minute interval
      // remains only as a fallback for background-tab timer throttling.
      if (midnightTimer !== null) window.clearTimeout(midnightTimer)
      const untilMidnight = millisecondsUntilNextLocalDay(now, zone)
      if (untilMidnight !== null) midnightTimer = window.setTimeout(sync, untilMidnight + 1000)

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
    const interval = window.setInterval(sync, 60_000)
    window.addEventListener('focus', sync)
    document.addEventListener('visibilitychange', sync)
    return () => {
      window.clearInterval(interval)
      if (midnightTimer !== null) window.clearTimeout(midnightTimer)
      window.removeEventListener('focus', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [router])
  return null
}
