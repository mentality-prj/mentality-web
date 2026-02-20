'use client'
import { Dispatch, SetStateAction } from 'react'

import { PersonalGoalsCard } from '@/components/features/MyProgress/PersonalGoals/PersonalGoalsCard'
import { GoalIconKey } from '@/components/features/MyProgress/PersonalGoals/personalGoalSuggestions'
import type { GoalEntity } from '@/types/api-responses'
import { Statuses } from '@/types/goals'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop: Dispatch<SetStateAction<GoalEntity[]>> = () => {}

function daysFromNow(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

const iconShowcaseItems: Array<{ id: string; iconKey: GoalIconKey; text: string }> = [
  { id: 'i-food', iconKey: 'food', text: 'Healthy eating' },
  { id: 'i-reading', iconKey: 'reading', text: 'Read every day' },
  { id: 'i-social', iconKey: 'social', text: 'Connect with friends' },
  { id: 'i-journaling', iconKey: 'journaling', text: 'Daily journal' },
  { id: 'i-noPhone', iconKey: 'noPhone', text: 'No phone morning' },
  { id: 'i-walk', iconKey: 'walk', text: 'Evening walk' },
  { id: 'i-art', iconKey: 'art', text: 'Art session' },
  { id: 'i-sleep', iconKey: 'sleep', text: 'Better sleep' },
  { id: 'i-sport', iconKey: 'sport', text: 'Morning workout' },
  { id: 'i-learning', iconKey: 'learning', text: 'Learn something new' },
  { id: 'i-health', iconKey: 'health', text: 'Drink 2L water' },
  { id: 'i-meditation', iconKey: 'meditation', text: 'Mindful breathing' },
]

export default function AdminGoalsPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* States */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-textcolor-primary">Card States</h2>
        <div className="grid grid-cols-4 gap-default">
          <PersonalGoalsCard
            id="s-active"
            text="Active goal without icon"
            check={0}
            repeat={1}
            status={Statuses.PENDING}
            setPersonalGoals={noop}
          />
          <PersonalGoalsCard
            id="s-progress"
            text="Active with 7-day progress"
            check={3}
            repeat={7}
            status={Statuses.PENDING}
            deadline={daysFromNow(4)}
            iconKey="sleep"
            setPersonalGoals={noop}
          />
          <PersonalGoalsCard
            id="s-completed"
            text="Week without sweets"
            check={7}
            repeat={7}
            status={Statuses.COMPLETED}
            iconKey="food"
            setPersonalGoals={noop}
          />
          <PersonalGoalsCard
            id="s-failed"
            text="Morning workout every day"
            check={2}
            repeat={30}
            status={Statuses.FAILED}
            iconKey="sport"
            setPersonalGoals={noop}
          />
        </div>
      </section>

      {/* Icons */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-textcolor-primary">Icon Variants</h2>
        <div className="grid grid-cols-4 gap-default">
          {iconShowcaseItems.map(({ id, iconKey, text }) => (
            <PersonalGoalsCard
              key={id}
              id={id}
              text={text}
              check={0}
              repeat={1}
              status={Statuses.PENDING}
              iconKey={iconKey}
              setPersonalGoals={noop}
            />
          ))}
        </div>
      </section>

      {/* Progress */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-textcolor-primary">Progress Variants</h2>
        <div className="grid grid-cols-5 gap-default">
          <PersonalGoalsCard
            id="p-0"
            text="Just started"
            check={0}
            repeat={30}
            status={Statuses.PENDING}
            deadline={daysFromNow(30)}
            iconKey="reading"
            setPersonalGoals={noop}
          />
          <PersonalGoalsCard
            id="p-10"
            text="One third done"
            check={10}
            repeat={30}
            status={Statuses.PENDING}
            deadline={daysFromNow(20)}
            iconKey="walk"
            setPersonalGoals={noop}
          />
          <PersonalGoalsCard
            id="p-15"
            text="Halfway there"
            check={15}
            repeat={30}
            status={Statuses.PENDING}
            deadline={daysFromNow(15)}
            iconKey="health"
            setPersonalGoals={noop}
          />
          <PersonalGoalsCard
            id="p-27"
            text="Almost done"
            check={27}
            repeat={30}
            status={Statuses.PENDING}
            deadline={daysFromNow(3)}
            iconKey="meditation"
            setPersonalGoals={noop}
          />
          <PersonalGoalsCard
            id="p-29"
            text="Due today"
            check={29}
            repeat={30}
            status={Statuses.PENDING}
            deadline={daysFromNow(0)}
            iconKey="food"
            setPersonalGoals={noop}
          />
        </div>
      </section>
    </div>
  )
}
