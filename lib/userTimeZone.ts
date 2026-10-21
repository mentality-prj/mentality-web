import { cookies } from 'next/headers'

import { isValidTimeZone, USER_TIME_ZONE_COOKIE } from '@/utils/timeZone'

/** Explicit browser IANA zone; unknown and tampered values fail closed. */
export async function getUserTimeZone(): Promise<string | null> {
  const candidate = (await cookies()).get(USER_TIME_ZONE_COOKIE)?.value
  return isValidTimeZone(candidate) ? candidate : null
}
