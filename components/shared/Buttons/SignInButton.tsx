import { getLocale, getTranslations } from 'next-intl/server'

import { signIn } from '@/auth'
import { ProviderKey, Providers } from '@/constants/providers'
import { Routes } from '@/constants/routes'
import { Button } from '@/ui/button'

interface SignInButtonProps {
  provider: ProviderKey
}

export default async function SignInButton({ provider }: SignInButtonProps) {
  const providerName = Providers[`${provider}`]
  const t = await getTranslations('common.Buttons')
  const textBtn = String(`${t('signInWith')} ${providerName}`)
  const locale = await getLocale()

  async function handleLogin() {
    'use server'
    await signIn(provider, { redirectTo: `/${locale}/${Routes.MYDAY}` })
  }

  return (
    <form className="pt-10 text-center" action={handleLogin}>
      <Button type="submit">{textBtn}</Button>
    </form>
  )
}
