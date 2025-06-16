import SignInButton from '@/components/Buttons/SignInButton'
import { ProviderKey, Providers } from '@/constants/providers'

export default function SignInPage() {
  const providersArray = Object.keys(Providers)
  const providersMap = providersArray.map((pr) => <SignInButton key={pr} provider={pr as ProviderKey} />)

  return <div>{providersMap}</div>
}
