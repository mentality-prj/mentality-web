import { defaultAPIUrl, defaultAPPUrl } from '@/constants/defaults'

export const APIUrl = process.env.NEXT_PUBLIC_API_URL || defaultAPIUrl

const configuredBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim().replace(/\/+$/, '')
export const APPUrl = configuredBaseUrl ? `${configuredBaseUrl}/api` : defaultAPPUrl
