import { getRequestConfig } from 'next-intl/server'

import { SupportedLanguage } from '@/types/languages'

import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as SupportedLanguage)) {
    locale = routing.defaultLocale
  }
  const messages = (await import(`../messages/${locale}`)).default

  return {
    locale,
    messages: messages,
  }
})
