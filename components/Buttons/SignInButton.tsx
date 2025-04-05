'use server'
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

  async function handleLogin() {
    'use server'
    await signIn(provider, { redirectTo: Routes.PROFILE })
  }

  return (
    <form className="pt-10 text-center" action={handleLogin}>
      <Button type="submit">{textBtn}</Button>
    </form>
  )
}
