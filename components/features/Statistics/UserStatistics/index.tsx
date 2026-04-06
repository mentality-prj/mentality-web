import { MoodStatistics, PsyTestsStatistics } from '@/types/userStatistics'

import { MetricCards } from '../MetricCards'
import { PsyTestsSection } from '../PsyTestsSection'
import { StreakBlock } from '../StreakBlock'
import { TopTagsChart } from '../TopTagsChart'
import { TrendChart } from '../TrendChart'
import { WeekdayHeatmap } from '../WeekdayHeatmap'

type UserStatisticsProps = {
  mood: MoodStatistics
  psyTests: PsyTestsStatistics | null
}

export function UserStatistics({ mood, psyTests }: UserStatisticsProps) {
  return (
    <div className="flex flex-col gap-md">
      <StreakBlock
        currentStreak={mood.currentStreak}
        longestStreak={mood.longestStreak}
        totalRecords={mood.totalRecords}
      />

      <MetricCards allTime={mood.allTime} last7d={mood.last7d} last30d={mood.last30d} />

      <TrendChart data={mood.trend30d} />

      <div className="grid grid-cols-1 gap-sm lg:grid-cols-2">
        <TopTagsChart tags={mood.topTags} />
        <WeekdayHeatmap data={mood.weekdayAverages} />
      </div>

      {psyTests && <PsyTestsSection k10={psyTests.k10} phq9={psyTests.phq9} gad7={psyTests.gad7} />}
    </div>
  )
}
