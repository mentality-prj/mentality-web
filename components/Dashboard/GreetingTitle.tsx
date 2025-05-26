import { auth } from '@/auth'

import { GreetingTime } from './GreetingTime'
import { LocalDate } from './LocalDate'

export const GreetingTitle = async () => {
  const session = await auth()
  const userName = session?.user?.name || 'Guest'

  return (
    <div className="text-textcolour-primary flex h-[88px] flex-row items-center justify-between bg-white px-[32px]">
      <span className="text-2xl/8 font-semibold">
        <GreetingTime />
        {userName}!
      </span>
      <span className="font-medium">
        <LocalDate />
      </span>
    </div>
  )
}
