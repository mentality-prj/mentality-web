import { AchievementCard } from './AchievementCard'

export const AchievementsList = () => {
  return (
    <div className="mb-5 mt-6 grid w-full grid-cols-3 gap-6">
      <AchievementCard status="locked" />
      <AchievementCard status="unlocked" />
    </div>
  )
}
