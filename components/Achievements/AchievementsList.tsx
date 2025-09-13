import { mockAchievements } from '@/REST/mockApi'

import { AchievementCard } from './AchievementCard'

export const AchievementsList = async () => {
  const achievementsData = await mockAchievements()
  return (
    <div className="mb-5 mt-6 grid w-full grid-cols-3 gap-6">
      {achievementsData.map((item) => (
        <AchievementCard key={item.id} {...item} />
      ))}
    </div>
  )
}
