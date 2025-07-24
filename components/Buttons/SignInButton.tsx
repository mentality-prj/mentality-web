'use server'
import { getLocale } from 'next-intl/server'

import { signIn } from '@/auth'
import { ProviderKey, Providers } from '@/constants/providers'
import { Routes } from '@/constants/routes'
import { Texts } from '@/constants/texts'
import { Button } from '@/ds/shadcn/button'

interface SignInButtonProps {
  provider: ProviderKey
}

export default async function SignInButton({ provider }: SignInButtonProps) {
  const providerName = Providers[`${provider}`]
  const textBtn = String(`${Texts.LOGIN_WITH} ${providerName}`)
  const locale = await getLocale()

  async function handleLogin() {
    'use server'
    await signIn(provider, { redirectTo: `/${locale}/${Routes.HOME}` })
  }

  return (
    <form className="pt-10 text-center" action={handleLogin}>
      <Button type="submit">{textBtn}</Button>
    </form>
  )
}
