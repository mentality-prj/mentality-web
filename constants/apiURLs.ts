import { defaultAPIUrl, defaultAPPUrl } from './defaults'

export const APIUrl = process.env.NEXT_PUBLIC_API_URL || defaultAPIUrl
export const APPUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api` || defaultAPPUrl
