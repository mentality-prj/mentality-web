import { auth } from '@/auth'

import { GreetingTitle } from './GreetingTitle'

export const GreetingTitleWrapper = async () => {
  const session = await auth()
  const userName = session?.user?.name || null

  return <GreetingTitle userName={userName} />
}
