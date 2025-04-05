import SignInButton from '@/components/Buttons/SignInButton'
import { ProviderKey, Providers } from '@/constants/providers'

export default function SignInPage() {
  const providersArray = Object.keys(Providers)
  const providersMap = providersArray.map((pr) => <SignInButton key={pr} provider={pr as ProviderKey} />)

  return <section className="mt-12 flex flex-col items-center gap-10">{providersMap}</section>
}
