import { auth } from '@/auth'
import { getAchievements } from '@/requests/achievements'

import { AchievementCard } from './AchievementCard'

export const AchievementsList = async () => {
  const session = await auth()
  const res = await getAchievements(session)
  const achievementsData = 'error' in res ? [] : (res.data ?? [])
  return (
    <div className="mb-5 mt-6 grid w-full grid-cols-3 gap-default">
      {achievementsData.map((item) => (
        <AchievementCard key={item.id} {...item} />
      ))}
    </div>
  )
}
