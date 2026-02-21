'use client'
import { Dispatch, SetStateAction } from 'react'

import { PersonalGoalsCard } from '@/components/features/MyProgress/PersonalGoals/PersonalGoalsCard'
import type { GoalEntity } from '@/types/api-responses'
import { GoalCategory, Statuses } from '@/types/goals'

// Note: This admin page is a static showcase for the PersonalGoalsCard component.
// We intentionally use a no-op setter here so actions (mark/reset/duplicate/delete)
// do not update the displayed goals in this read-only demo.
// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop: Dispatch<SetStateAction<GoalEntity[]>> = () => {}

function daysFromNow(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

const iconShowcaseItems: Array<{ id: string; category: GoalCategory; text: string }> = [
  { id: 'i-food', category: 'food', text: 'Healthy eating' },
  { id: 'i-reading', category: 'reading', text: 'Read every day' },
  { id: 'i-social', category: 'social', text: 'Connect with friends' },
  { id: 'i-journaling', category: 'journaling', text: 'Daily journal' },
  { id: 'i-noPhone', category: 'noPhone', text: 'No phone morning' },
  { id: 'i-walk', category: 'walk', text: 'Evening walk' },
  { id: 'i-art', category: 'art', text: 'Art session' },
  { id: 'i-sleep', category: 'sleep', text: 'Better sleep' },
  { id: 'i-sport', category: 'sport', text: 'Morning workout' },
  { id: 'i-learning', category: 'learning', text: 'Learn something new' },
  { id: 'i-health', category: 'health', text: 'Drink 2L water' },
  { id: 'i-meditation', category: 'meditation', text: 'Mindful breathing' },
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
            category="default"
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
            category="sleep"
            setPersonalGoals={noop}
          />
          <PersonalGoalsCard
            id="s-completed"
            text="Week without sweets"
            check={7}
            repeat={7}
            status={Statuses.COMPLETED}
            category="food"
            setPersonalGoals={noop}
          />
          <PersonalGoalsCard
            id="s-failed"
            text="Morning workout every day"
            check={2}
            repeat={30}
            status={Statuses.FAILED}
            category="sport"
            setPersonalGoals={noop}
          />
        </div>
      </section>

      {/* Icons */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-textcolor-primary">Icon Variants</h2>
        <div className="grid grid-cols-4 gap-default">
          {iconShowcaseItems.map(({ id, category, text }) => (
            <PersonalGoalsCard
              key={id}
              id={id}
              text={text}
              check={0}
              repeat={1}
              status={Statuses.PENDING}
              category={category}
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
            category="reading"
            setPersonalGoals={noop}
          />
          <PersonalGoalsCard
            id="p-10"
            text="One third done"
            check={10}
            repeat={30}
            status={Statuses.PENDING}
            deadline={daysFromNow(20)}
            category="walk"
            setPersonalGoals={noop}
          />
          <PersonalGoalsCard
            id="p-15"
            text="Halfway there"
            check={15}
            repeat={30}
            status={Statuses.PENDING}
            deadline={daysFromNow(15)}
            category="health"
            setPersonalGoals={noop}
          />
          <PersonalGoalsCard
            id="p-27"
            text="Almost done"
            check={27}
            repeat={30}
            status={Statuses.PENDING}
            deadline={daysFromNow(3)}
            category="meditation"
            setPersonalGoals={noop}
          />
          <PersonalGoalsCard
            id="p-29"
            text="Due today"
            check={29}
            repeat={30}
            status={Statuses.PENDING}
            deadline={daysFromNow(0)}
            category="food"
            setPersonalGoals={noop}
          />
        </div>
      </section>
    </div>
  )
}
