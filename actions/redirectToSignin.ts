'use server'

import { getLocale } from 'next-intl/server'

import { Routes } from '@/constants/routes'
import { redirect } from '@/i18n/navigation'

export async function redirectToSignin() {
  const locale = await getLocale()
  redirect({ href: Routes.SIGNIN, locale: locale })
}
